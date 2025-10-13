// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/Login.jsx';
// import SignupPage from './components/Signup.jsx';
// import DashboardPage from './components/Dashboard.jsx';
// import AddLeadPage from './components/AddLead.jsx';
// import LeadPage from './components/Lead.jsx';
// import Layout from './components/Layout.jsx';
// import AddBulkLeadPage from './components/AddBulkLead.jsx';
// import UploadPdfPage from './components/UploadPdfPage.jsx';
// import ColumnMapper from './components/ColumnMapper.jsx';

// // Helper component for private routes
// const ProtectedRoute = ({ children, isAuthenticated }) => {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//         !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
//     );

//   return (
//     <div className="bg-[#121212] min-h-screen text-white font-sans">
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<LoginPage onLogin={setIsAuthenticated} />} />
//           <Route path="/signup" element={<SignupPage />} />

//           {/* Protected Routes with a common layout */}
//           <Route path="/" element={
//             <ProtectedRoute isAuthenticated={isAuthenticated}>
//               <Layout />
//             </ProtectedRoute>
//           }>
//             <Route path="dashboard" element={<DashboardPage />} />
//             <Route path="leads" element={<LeadPage />} />
//             <Route path="add-lead" element={<AddLeadPage />} />
//             <Route path="add-bulk-lead" element={<AddBulkLeadPage />} />
            
//           </Route>

//           {/* Catch-all route for unmatched paths */}
//           <Route path="*" element={<Navigate to="/login" />} />
//           <Route path="upload-pdf" element={<UploadPdfPage />} />
//           <Route path="workflows" element={<ColumnMapper />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// };

// export default App;
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadPdfPage from './components/UploadPdfPage.jsx';

const App = () => {
  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadPdfPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
