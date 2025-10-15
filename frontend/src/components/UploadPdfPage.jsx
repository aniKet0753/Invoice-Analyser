import React, { useState, useRef, useEffect } from "react";
import axios from "../api";

// import.meta.env.VITE_API_URL ||"";

import { UploadCloud, Loader, Zap, ChevronLeft, ChevronRight, Eye, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function PdfAnalyzer() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editedJson, setEditedJson] = useState("");
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fetchingFile, setFetchingFile] = useState(false);

  const fileInputRef = useRef(null);
  const iframeRef = useRef(null);
  const handleFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    const files = Array.from(e.target.files);

    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileObj: file, // store actual file object here
      fileURL: URL.createObjectURL(file),
      analysisData: null,
      uploadedAt: new Date().toLocaleString(),
      status: "pending",
      jsonData: null,
    }));

    setUploadedFiles(newFiles);
    setCurrentIndex(0);
    setEditedJson("");
  }
};


  const handleButtonClick = () => {
    if (!loading && !fetchingFile) fileInputRef.current?.click();
  };

  useEffect(() => {
    if (uploadedFiles.length > 0 && currentIndex < uploadedFiles.length) {
      loadFile();
    }
  }, [currentIndex, uploadedFiles]);

  const loadFile = async () => {
    setFetchingFile(true);
    setError("");
    
    const currentFile = uploadedFiles[currentIndex];
    
    
  try {
    //  If we already have analysis data, just show it
    if (currentFile.analysisData) {
      setPdfUrl(currentFile.fileURL);
      setEditedJson(JSON.stringify(currentFile.analysisData, null, 2));
      setFetchingFile(false);
      return;
    }

    //  Otherwise, upload to backend and fetch analysis
    const formData = new FormData();
    formData.append("file", currentFile.fileObj);

    const response = await axios.post(`analyze-pdf/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Analysis response:", response.data);
    let analysisData = response.data.result || [];
    if (!Array.isArray(analysisData)) analysisData = [analysisData];

    setUploadedFiles((prev) =>
      prev.map((f, idx) =>
        idx === currentIndex
          ? { ...f, analysisData: analysisData[0], jsonData: analysisData[0] }
          : f
      )
    );

    setPdfUrl(currentFile.fileURL);
    setEditedJson(JSON.stringify(analysisData[0], null, 2));
  } catch (err) {
    console.error("Error loading file:", err);
    setError("Error analyzing file. Please try again.");
  } finally {
    setFetchingFile(false);
  }
};

  const handleJsonEdit = (e) => {
    setEditedJson(e.target.value);
  };

  const handleNext = () => {
    if (currentIndex < uploadedFiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPdfUrl("");
      setEditedJson("");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPdfUrl("");
      setEditedJson("");
    }
  };

const handleApprove = async () => {
  if (!uploadedFiles[currentIndex]) return;

  setSaving(true);
  setError("");

  try {
    let parsedJson;
    try {
      parsedJson = JSON.parse(editedJson);
    } catch (parseErr) {
      setError("Invalid JSON format. Please fix the JSON and try again.");
      setSaving(false);
      return;
    }

    const data = Array.isArray(parsedJson) ? parsedJson[0] : parsedJson;

    if (!data.Distributor_Name?.trim()) {
      setError("Distributor Name is required");
      setSaving(false);
      return;
    }
    if (!data.Retailer_Name?.trim()) {
      setError("Retailer Name is required");
      setSaving(false);
      return;
    }

    const payload = {
      distributor_name: data.Distributor_Name || "",
      retailer_name: data.Retailer_Name || "",
      retailer_address: data.Retailer_Address || "",
      retailer_state: data.Retailer_State || "",
      invoice_total: parseFloat(data.Invoice_Total) || 0,
      water_total: parseFloat(data.Water_Total) || 0,
      net_total: parseFloat(data.Net_Total) || 0,
      invoice_date: data.Invoice_Date || null,
    };

    console.log("Saving payload to backend:", payload);

    // ✅ Save to your backend
    const response = await axios.post(`analyze-pdf/save-invoice`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Response from backend:", response.data);

    setUploadedFiles((prev) =>
      prev.map((f, idx) =>
        idx === currentIndex ? { ...f, status: "approved", jsonData: parsedJson } : f
      )
    );

    alert("✅ Invoice saved successfully to database!");

    if (currentIndex < uploadedFiles.length - 1) {
      setTimeout(() => handleNext(), 500);
    }
  } catch (err) {
    console.error("Save Error:", err);
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Error saving invoice.";
    setError(msg);
  } finally {
    setSaving(false);
  }
};


  const currentFile = uploadedFiles[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-gray-100 p-4 font-inter">
      <div className="max-w-full mx-auto">
        {uploadedFiles.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-gray-800 border border-indigo-700/50 shadow-2xl rounded-3xl p-8 w-full max-w-lg">
              <h1 className="text-3xl font-bold mb-8 flex items-center justify-center text-indigo-400">
                <Zap className="w-6 h-6 mr-3 text-yellow-400 animate-pulse" />
                Invoice Analyzer
              </h1>

              <input
                type="file"
                id="file-upload"
                name="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
                className="hidden"
              />

              <div
                onClick={handleButtonClick}
                className={`flex flex-col items-center justify-center p-8 border-2 rounded-2xl cursor-pointer transition duration-300 ease-in-out border-indigo-600 border-dashed hover:border-indigo-400 bg-gray-800/70 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <div className="p-3 rounded-full mb-3 bg-indigo-600/20 text-indigo-400">
                  {loading ? <Loader className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
                </div>
                <p className="text-lg font-medium text-gray-200">{loading ? "Processing..." : "Click to Upload Documents"}</p>
                <p className="text-sm text-gray-400 mt-1">Max 10 MB per file. Supported: PDF, JPG, PNG, JPEG (Multiple files allowed)</p>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300 flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">Error:</p>
                    <p className="text-sm whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold flex items-center text-indigo-400">
                <Zap className="w-6 h-6 mr-3 text-yellow-400 animate-pulse" />
                Invoice Analyzer
              </h1>

              <button
                onClick={handleButtonClick}
                disabled={loading || fetchingFile}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  loading || fetchingFile
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/50"
                }`}
              >
                <Plus className="w-5 h-5" />
                Upload More
              </button>

              <input
                type="file"
                id="file-upload"
                name="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
                className="hidden"
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300 flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Error:</p>
                  <p className="text-sm whitespace-pre-wrap">{error}</p>
                </div>
              </div>
            )}

            {fetchingFile && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                <div className="bg-gray-800 border border-indigo-700/50 rounded-lg p-8 flex flex-col items-center gap-4">
                  <Loader className="w-10 h-10 animate-spin text-indigo-400" />
                  <p className="text-gray-200 font-medium">Loading document...</p>
                </div>
              </div>
            )}

            {currentFile && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Side - Preview */}
                <div className="bg-gray-800 border border-indigo-700/50 rounded-3xl p-6 flex flex-col h-screen-helper">
                  <h2 className="text-xl font-bold text-indigo-300 flex items-center mb-4">
                    <Eye className="w-5 h-5 mr-2" />
                    Document Preview
                  </h2>

                  <div className="flex-1 bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700 relative">
                    {pdfUrl ? (
                      currentFile.fileType === "application/pdf" ? (
                        <iframe
                          ref={iframeRef}
                          src={pdfUrl}
                          className="w-full h-full rounded-lg"
                          title="PDF Preview"
                        />
                      ) : (
                        <img
                          src={pdfUrl}
                          alt="Invoice Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Loader className="w-8 h-8 animate-spin text-indigo-400" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                    <p>
                      <span className="font-semibold text-gray-300">File:</span> {currentFile.fileName}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">Size:</span> {(currentFile.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">Uploaded:</span> {currentFile.uploadedAt}
                    </p>
                    <p className="mt-3">
                      <span
                        className={`font-bold text-sm px-2 py-1 rounded ${
                          currentFile.status === "approved"
                            ? "bg-green-600/30 text-green-400"
                            : "bg-yellow-600/30 text-yellow-400"
                        }`}
                      >
                        Status: {currentFile.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right Side - JSON Editor */}
                <div className="bg-gray-800 border border-indigo-700/50 rounded-3xl p-6 flex flex-col h-screen-helper">
                  <h2 className="text-xl font-bold mb-4 text-indigo-300 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    JSON Data (Editable)
                  </h2>

                  <textarea
                    value={editedJson}
                    onChange={handleJsonEdit}
                    className="flex-1 bg-gray-900/50 text-gray-100 border border-indigo-500/50 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition resize-none mb-4"
                    placeholder="JSON will appear here..."
                    spellCheck="false"
                  />

                  <button
                    onClick={handleApprove}
                    disabled={saving || currentFile.status === "approved"}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                      currentFile.status === "approved"
                        ? "bg-green-600/50 text-green-300 cursor-default"
                        : saving
                        ? "bg-indigo-600/50 text-indigo-300 cursor-wait"
                        : "bg-green-600 text-white hover:bg-green-500 shadow-lg hover:shadow-green-500/50"
                    }`}
                  >
                    {saving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {currentFile.status === "approved" ? "✓ Approved" : "Approve & Save"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {uploadedFiles.length > 1 && (
              <div className="flex items-center justify-center gap-4 sticky bottom-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0 || fetchingFile}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    currentIndex === 0 || fetchingFile
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="bg-gray-800 border border-indigo-700/50 px-4 py-2 rounded-lg">
                  <span className="text-gray-300 font-medium">
                    {currentIndex + 1} / {uploadedFiles.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === uploadedFiles.length - 1 || fetchingFile}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    currentIndex === uploadedFiles.length - 1 || fetchingFile
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
  /* Allow larger preview height */
  .h-screen-helper {
    max-height: calc(100vh - 140px);
    height: calc(100vh - 140px);
  }

  /* Make iframe or image use full space nicely */
  iframe, img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
    textarea {
  font-size: 13px;
  line-height: 1.4;
  overflow-y: auto;
}


  /* Make sure text area and preview are balanced on large screens */
  @media (min-width: 1024px) {
    .h-screen-helper {
      max-height: calc(100vh - 120px);
    }
  }
`}</style>

    </div>
  );
}
