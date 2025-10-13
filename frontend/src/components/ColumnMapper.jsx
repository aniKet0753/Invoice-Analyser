import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function ColumnMapper() {
  const [excelColumns, setExcelColumns] = useState([]);
  const [sheetColumns, setSheetColumns] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  // 🔗 Hardcode your Google Sheet URL
  const GOOGLE_SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1Jha-JF1NBLgjcU_n2NW_kh9X9fMaQtyTwUk_vg8jaAs/edit?usp=sharing";

  // 🧾 Extract Excel columns
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length > 0) {
        setExcelColumns(data[0]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 📥 Auto-fetch Google Sheet columns
  useEffect(() => {
    const fetchGoogleSheetColumns = async () => {
      try {
        const match = GOOGLE_SHEET_URL.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) return alert("Invalid Google Sheet URL");
        const sheetId = match[1];
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

        const response = await fetch(csvUrl);
        const text = await response.text();
        const [firstLine] = text.split("\n");
        // Simple check to ensure we got something
        if (firstLine) {
            const columns = firstLine.split(",").map((col) => col.trim()).filter(col => col.length > 0);
            setSheetColumns(columns);
        } else {
            console.warn("Google Sheet CSV was empty.");
        }
      } catch (error) {
        alert("Failed to fetch Google Sheet columns");
        console.error(error);
      }
    };

    fetchGoogleSheetColumns();
  }, []);

  // 🪄 Handle mapping
  const handleMappingChange = (excelCol, targetCol) => {
    setColumnMapping((prev) => ({
      ...prev,
      [excelCol]: targetCol,
    }));
  };

  // 📤 Save mapping
  const handleSave = () => {
    console.log("Column Mapping:", columnMapping);
    alert("Mapping saved! Check console for output.");
  };

  return (
    // **Aesthetic/Futuristic Dark Background**
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-400 tracking-wider">
        Data Bridge: Column Mapper
      </h1>
      
      {/* Container Style: Darker card, rounded, subtle shadow */}
      
      {/* Google Sheet Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-6 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
          1️⃣ Target Sheet Columns
        </h2>

        {sheetColumns.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {sheetColumns.map((col, i) => (
              // **Professional/Modern Tag Style**
              <span
                key={i}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium shadow-md transition duration-300 hover:bg-indigo-500"
              >
                {col}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Loading Google Sheet columns...</p>
        )}
      </div>

      {/* Excel Upload Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-6 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
          2️⃣ Upload Source Excel
        </h2>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleExcelUpload}
          // Input styling for dark mode
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer transition duration-300 border border-gray-600 rounded-lg p-3"
        />

        {excelColumns.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-700">
            <p className="font-semibold mb-3 text-gray-200">
              Uploaded Excel Columns:
            </p>
            <div className="flex flex-wrap gap-3">
              {excelColumns.map((col, i) => (
                // **Professional/Modern Tag Style**
                <span
                  key={i}
                  className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium shadow-md transition duration-300 hover:bg-teal-500"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mapping Section */}
      {excelColumns.length > 0 && sheetColumns.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
            3️⃣ Define Mapping
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm rounded-lg overflow-hidden border border-gray-700">
              {/* Table Header Style: Contrasting dark background */}
              <thead className="bg-gray-700 text-gray-100">
                <tr>
                  <th className="p-3 border-r border-gray-600 text-left">
                    Source (Excel)
                  </th>
                  <th className="p-3 w-10 text-center text-indigo-400">→</th>
                  <th className="p-3 text-left">Target (Google Sheet)</th>
                </tr>
              </thead>
              <tbody>
                {excelColumns.map((excelCol, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 transition duration-300 hover:bg-gray-700"
                  >
                    <td className="p-3 border-r border-gray-700 font-medium text-teal-300">
                      {excelCol}
                    </td>
                    <td className="p-3 text-center text-indigo-400">→</td>
                    <td className="p-3">
                      <select
                        value={columnMapping[excelCol] || ""}
                        onChange={(e) =>
                          handleMappingChange(excelCol, e.target.value)
                        }
                        // Select styling for dark mode
                        className="border border-gray-600 bg-gray-900 text-gray-100 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                      >
                        <option value="" className="text-gray-400">
                          Select Target Column...
                        </option>
                        {sheetColumns.map((sheetCol, i) => (
                          <option key={i} value={sheetCol}>
                            {sheetCol}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Button Style: Vibrant accent color, professional feel */}
          <button
            onClick={handleSave}
            className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:bg-indigo-600 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            🚀 Save Column Mapping
          </button>
        </div>
      )}
    </div>
  );
}