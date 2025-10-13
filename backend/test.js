require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const express = require('express');
const router = express.Router();
const Tesseract = require('tesseract.js'); // for OCR (image to text)

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let extractedText = '';

    // 🔹 1. Handle PDF extraction
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    }

    // 🔹 2. Handle image extraction (JPG, PNG, JPEG, etc.)
    else if (mimeType.startsWith('image/')) {
      const ocrResult = await Tesseract.recognize(filePath, 'eng');
      extractedText = ocrResult.data.text;
    }

    // 🔹 3. Unsupported file types
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type. Please upload an image or PDF.' });
    }

    // Remove temp file after reading
    fs.unlinkSync(filePath);

    // 🔹 4. Send extracted text to OpenAI for structured JSON output
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a data extraction AI. 
From the provided invoice text, extract the following information and return it strictly in JSON format.
This invoice is raise from the distributor to the retailer

Required fields:
- Distributor_Name
- Retailer_Name
- Retailer_Address
- Retailer_State
- Invoice_Total
- Water_Total (Independence Water total including all GST's and taxes if available)
- Net_Total (Invoice_Total minus Water_Total)
-Invoice_Date (in DD-MM-YYYY format)

Rules:
- Always return a valid JSON array (even if there’s only one record).
- Do not include any explanations or text outside JSON.

Example output:
[
  {
    "Distributor_Name": "XYZ Distributors",
    "Retailer_Name": "ABC Supermarket",
    "Retailer_Address": "123 Market Road, Delhi",
    "Retailer_State": "Delhi",
    "Invoice_Total": 12500.00,
    "Water_Total": 800.00,
    "Net_Total": 11700.00
  }
]

Now extract the data from the following invoice text:
{{INVOICE_TEXT}}
`
        },
        {
          role: 'user',
          content: extractedText.slice(0, 10000) || 'No readable text found.'
        },
      ],
    });

    // 🔹 5. Send AI result to client
    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// const { Groq } = require('groq-sdk');
// require('dotenv').config();
// const groq = new Groq({ apiKey: process.env.GROK_API_KEY });

// (async () => {
//   try {
//     const models = await groq.models.list();
//     console.log(models);
//   } catch (err) {
//     console.error("Error fetching models:", err);
//   }
// })();
