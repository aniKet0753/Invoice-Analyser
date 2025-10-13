import React, { useState, useRef } from "react";
import axios from "../api";
import { UploadCloud, CheckCircle, FileText, Loader, Zap, Image as ImageIcon } from "lucide-react";

export default function PdfAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setAnalysis("");
      setError("");

      // Create image preview for image files
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewURL(imageUrl);
      } else {
        setPreviewURL("");
      }
    }
  };

  const handleButtonClick = () => {
    if (!loading) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF or image file first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");

    const formData = new FormData();
    formData.append("file", selectedFile); // match backend's upload.single('file')

    const authToken = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const response = await axios.post("analyze-pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      setAnalysis(response.data.summary || response.data.result);
    } catch (err) {
      console.error("Upload Error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.error ||
            err.response.data.details ||
            err.response.data.message ||
            "Server Error during analysis."
        );
      } else {
        setError("Network Error: Could not reach the API.");
      }
    } finally {
      setLoading(false);
    }
  };

  const glowClass =
    "shadow-[0_0_10px_#4F46E5,0_0_25px_#4F46E5] hover:shadow-[0_0_20px_#818CF8,0_0_40px_#818CF8]";
  const analysisGlow = "shadow-[0_0_15px_rgba(79,70,229,0.5)]";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-gray-800 border border-indigo-700/50 shadow-2xl rounded-3xl p-8 w-full max-w-lg text-center backdrop-blur-sm bg-opacity-80 transition-all duration-500">
        <h1 className="text-3xl font-bold mb-8 flex items-center justify-center text-indigo-400">
          <Zap className="w-6 h-6 mr-3 text-yellow-400 animate-pulse" />
          Document Analyzer
        </h1>

        <input
          type="file"
          id="file-upload"
          name="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Drop zone */}
        <div
          onClick={handleButtonClick}
          className={`flex flex-col items-center justify-center p-8 mb-8 border-2 rounded-2xl cursor-pointer transition duration-300 ease-in-out 
              ${selectedFile ? "border-green-500 bg-gray-700/50" : "border-indigo-600 border-dashed hover:border-indigo-400 bg-gray-800/70"}
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          <div
            className={`p-3 rounded-full mb-3 transition-colors duration-300 
              ${selectedFile ? "bg-green-600/20 text-green-400" : "bg-indigo-600/20 text-indigo-400"}
          `}
          >
            {selectedFile ? (
              selectedFile.type.startsWith("image/") ? (
                <ImageIcon className="w-8 h-8" />
              ) : (
                <CheckCircle className="w-8 h-8" />
              )
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <p className="text-lg font-medium text-gray-200">
            {selectedFile ? `File Ready: ${selectedFile.name}` : "Select PDF or Image"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {selectedFile
              ? `Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
              : "Max 10 MB. Supported: PDF, JPG, PNG, JPEG"}
          </p>

          {/* Show image preview */}
          {previewURL && (
            <img
              src={previewURL}
              alt="preview"
              className="mt-4 rounded-lg max-h-48 object-contain border border-gray-700"
            />
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className={`w-full text-white px-4 py-4 rounded-xl font-bold uppercase tracking-wider transition duration-300 
          ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 " + glowClass
          }
          flex items-center justify-center`}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Analyze Document
            </>
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-left font-mono">
            <p className="font-bold mb-1">Error Detected:</p>
            <p className="text-sm whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {analysis && (
          <div
            className={`text-left mt-8 p-6 bg-gray-700/60 border border-indigo-600/50 rounded-2xl max-h-96 overflow-y-auto ${analysisGlow}`}
          >
            <h2 className="text-xl font-bold mb-3 text-indigo-300 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              AI Summary Report:
            </h2>
            <div className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed border-t border-indigo-600 pt-3">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}