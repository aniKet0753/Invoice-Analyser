require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const express = require('express');
const router = express.Router();
const Tesseract = require('tesseract.js');
const { supabase } = require("./db/supabaseClient");


const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});


router.post("/save-invoice", async (req, res) => {
  try {
    const {
      distributor_name,
      retailer_name,
      retailer_address,
      retailer_state,
      invoice_total,
      water_total,
      net_total,
      invoice_date,
    } = req.body;

    // Validate required fields
    if (!distributor_name || !retailer_name) {
      return res.status(400).json({ error: "Distributor and Retailer name are required" });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("invoices")
      .insert([
        {
          distributor_name,
          retailer_name,
          retailer_address,
          retailer_state,
          invoice_total,
          water_total,
          net_total,
          invoice_date,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({
      message: "Invoice saved successfully",
      data,
    });
  } catch (err) {
    console.error("Server error in /save-invoice:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let extractedText = '';


    // 🔹 1. Handle PDF extraction
if (mimeType === "application/pdf") {
  const path = require("path");
  const poppler = require("pdf-poppler");
  const { createWorker } = require("tesseract.js");

  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  extractedText = pdfData.text;

  // 🧠 Fallback OCR for scanned PDFs
  if (!extractedText || extractedText.trim().length < 10) {

    const outputBaseName = path.basename(filePath, path.extname(filePath));
    const outputDir = path.join(__dirname, "temp_ocr");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    try {
      // Convert PDF pages → PNG images
      const options = {
        format: "png",
        out_dir: outputDir,
        out_prefix: outputBaseName,
        page: null,
      };
      await poppler.convert(filePath, options);

      // OCR every generated image
      const files = fs
        .readdirSync(outputDir)
        .filter((f) => f.startsWith(outputBaseName) && f.endsWith(".png"));

      let ocrText = "";
      const worker = await createWorker("eng", 1);

      for (const imgFile of files) {
        const imgPath = path.join(outputDir, imgFile);
        const {
          data: { text },
        } = await worker.recognize(imgPath);
        ocrText += "\n" + text;
      }

      await worker.terminate();
      extractedText = ocrText;
    } catch (ocrErr) {
      console.error("❌ OCR fallback failed:", ocrErr);
    } finally {
      try {
        fs.rmSync(outputDir, { recursive: true, force: true });
      } catch (cleanupErr) {
        console.error("Error cleaning temp OCR files:", cleanupErr);
      }
    }
  }
}



    // 🔹 2. Handle image extraction (JPG, PNG, JPEG, etc.)
    else if (mimeType.startsWith('image/')) {
      const ocrResult = await Tesseract.recognize(filePath, 'eng', {
        logger: info => console.log(' Progressing:', info)
      });
      extractedText = ocrResult.data.text;
    }

    // 🔹 3. Unsupported file types
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type. Please upload an image or PDF.' });
    }

    // Check if we got any text
    if (!extractedText || extractedText.trim().length < 10) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        error: 'Could not extract sufficient text from the document. Please ensure the document is clear and readable.' 
      });
    }

    // Remove temp file after reading
    fs.unlinkSync(filePath);
    filePath = null;

    console.log('Sending to AI for analysis...');

    // 🔹 4. Send extracted text to OpenAI for structured JSON output
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a data extraction AI specialized in invoice processing.
Extract information from the provided invoice text and return ONLY a valid JSON array.

This invoice is raised from the distributor to the retailer.

Required fields (all must be present):
- Distributor_Name: string
- Retailer_Name: string
- Retailer_Address: string
- Retailer_State: string
- Invoice_Total: number (total invoice amount)
- Water_Total: number (water products total including GST)
- Net_Total: number (Invoice_Total minus Water_Total)
- Invoice_Date: string (format: DD-MM-YYYY)

CRITICAL RULES:
1. Return ONLY a JSON array, nothing else
2. No markdown formatting, no code blocks, no explanations
3. All numeric values must be numbers, not strings
4. If a field cannot be found, use null or empty string
5. Calculate Net_Total as (Invoice_Total - Water_Total)

Example (return exactly in this format):
[{"Distributor_Name":"XYZ Distributors","Retailer_Name":"ABC Supermarket","Retailer_Address":"123 Market Road, Delhi","Retailer_State":"Delhi","Invoice_Total":12500.00,"Water_Total":800.00,"Net_Total":11700.00,"Invoice_Date":"15-01-2025"}]`
        },
        {
          role: 'user',
          content: extractedText.slice(0, 15000)
        },
      ],
      temperature: 0.1,
    });

    // 🔹 5. Extract and clean the response
    let aiResponse = completion.choices[0].message.content;
    
    // Remove any markdown code blocks
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Remove any leading/trailing whitespace or newlines
    aiResponse = aiResponse.trim();
    
    // Try to find JSON array in the response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }


    // 🔹 6. Parse JSON to validate
    let parsedData;
    try {
      parsedData = JSON.parse(aiResponse);
      
      // Ensure it's an array
      if (!Array.isArray(parsedData)) {
        parsedData = [parsedData];
      }

      // Validate required fields
      if (parsedData.length > 0) {
        const requiredFields = [
          'Distributor_Name', 
          'Retailer_Name', 
          'Retailer_Address', 
          'Retailer_State', 
          'Invoice_Total', 
          'Water_Total', 
          'Net_Total',
          'Invoice_Date'
        ];
        
        const firstRecord = parsedData[0];
        const missingFields = requiredFields.filter(field => !(field in firstRecord));
        
        if (missingFields.length > 0) {
          console.warn('Missing fields:', missingFields);
        }
      }


    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Failed to parse:', aiResponse);
      
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        details: 'The AI did not return valid JSON format. Please try uploading the document again.',
        rawResponse: aiResponse.substring(0, 500)
      });
    }

    // 🔹 7. Send validated JSON to client
    res.json({
      result: parsedData,
      message: 'Document analyzed successfully'
    });

  } catch (err) {
    console.error('Server Error:', err);
    
    // Clean up file if it still exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    }
    
    res.status(500).json({ 
      error: 'An error occurred during processing',
      message: err.message,
      details: err.stack
    });
  }
});

module.exports = router;