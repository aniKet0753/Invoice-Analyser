// const express = require('express');
// const agentRoutes = require('./routes/agentRoutes');
// const leadRoutes = require('./routes/leadRoutes');
// const retailAIRoutes = require('./routes/retailAIWebhook'); // triggers Retail AI call
// const retailAITriggerRoutes = require("./routes/retailAITriggerRoutes");

// const cors = require('cors');
// const app = express();
// const port = process.env.PORT || 5002;


// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// // // Routes
// // app.use('/api/agents', agentRoutes);

// // app.use('/api/leads', leadRoutes);
// // app.use('/api/otp', require('./routes/otpRoutes'));
// // // app.use('/api/ai-assistant', require('./routes/aiLeads'));
// // app.use('/api/ai-assistant', require('./routes/aiAssistant'));
// // // app.use('/api/retailai', retailAITriggerRoutes); //

// app.use('/analyze-pdf', require('./test')); // PDF analysis route

// // app.get('/', (req, res) => {
// //     res.send('AgentSuit Backend API is working!');
// // });
 
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
// backend/server.js
// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Your routes
app.use("/analyze-pdf", require("./test")); // PDF analysis route

// ✅ Health check route
app.get("/health", (req, res) => {
  res.send("✅ PDF Analyzer Backend is running fine.");
});

// ✅ Export for Vercel (do NOT call app.listen here)
module.exports = app;

// ✅ If running locally (e.g., `node server.js`)
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}