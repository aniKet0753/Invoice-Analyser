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
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Single route — your PDF analyzer
app.use('/', require('./test')); // serves as the home route (http://localhost:5001/)

// ✅ (Optional) Health check route
app.get('/health', (req, res) => {
  res.send('✅ PDF Analyzer Backend is running fine.');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
