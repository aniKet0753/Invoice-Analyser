// const { Readable } = require("stream");
// const cron = require("node-cron");
// const csv = require("csv-parser");
// const supabase = require("../db/supabaseClient");
// const { addLeadSchema } = require("../schemas/leadSchema");
// const { sendMail, scheduleLeadEmails } = require("../mailers/mailer");
// const {
//   sendSellerMail,
//   scheduleSellerLeadEmails,
// } = require("../mailers/mailer2");
// // const { initiateBuyerWorkflow, initiateSellerWorkflow } = require("../mailers/flowdeskMailer")
// const { scheduleBuyerTexts } = require("../textmailers/buyerSendText");
// const { scheduleSellerTexts } = require("../textmailers/SellerSendText2");
// const { sendSMS } = require("../textmailers/SellerSendText2"); // adjust path if needed

// // const {triggerRetailAIAgent  } = require("./triggerAIAgentCall")
// // triggerRetailAIAgent({ phone: "9122503536", name: "Rahul Sharma" });
// // const { triggerRetailAIWebhook } = require("../routes/retailAIWebhook");
// // const { triggerRetailAIAgent } = require("../controllers/triggerAIAgentCall");
// const { processPendingSMS } = require("../textmailers/SellerSendText2");

// // Define required headers for the CSV file
// const REQUIRED_HEADERS = [
//   "first_name",
//   "last_name",
//   "email",
//   "phone_number",
//   "status",
//   "source",
//   "type",
//   "notes",
//   "property_type",
//   "budget_range",
//   "preferred_location",
//   "bedrooms",
//   "bathrooms",
//   "timeline",
//   "social_media",
// ];

// // Helper function to safely parse integer values, handling empty strings and non-numeric input
// const parseInteger = (value) => {
//   if (value === null || value === undefined || value.trim() === "") {
//     return null;
//   }
//   const parsed = parseInt(value, 10);
//   return isNaN(parsed) ? null : parsed;
// };

// exports.bulkUploadLeads = async (req, res) => {
//   // Check if a file was uploaded
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded." });
//   }

//   const leads = [];
//   const validationErrors = [];
//   const bufferStream = new Readable();
//   bufferStream.push(req.file.buffer);
//   bufferStream.push(null);

//   let hasHeaders = false;

//   // Parse the CSV file
//   bufferStream
//     .pipe(csv())
//     .on("headers", (headers) => {
//       // Validate headers
//       const missingHeaders = REQUIRED_HEADERS.filter(
//         (header) => !headers.includes(header)
//       );
//       if (missingHeaders.length > 0) {
//         // To avoid sending response multiple times, push an error to the array
//         validationErrors.push(
//           `Missing required headers: ${missingHeaders.join(", ")}`
//         );
//         bufferStream.destroy(); // Stop parsing
//       }
//       hasHeaders = true;
//     })
//     .on("data", (data) => {
//       if (validationErrors.length) return; // Skip data processing if headers are missing

//       const leadData = {
//         user_id: req.user.userId,
//         first_name: data.first_name,
//         last_name: data.last_name,
//         email: data.email,
//         phone_number: data.phone_number,
//         status: data.status,
//         source: data.source,
//         type: data.type,
//         notes: data.notes,
//         property_type: data.property_type,
//         budget_range: data.budget_range,
//         preferred_location: data.preferred_location,
//         bedrooms: parseInteger(data.bedrooms),
//         bathrooms: parseInteger(data.bathrooms),
//         timeline: data.timeline,
//         social_media: data.social_media ? JSON.parse(data.social_media) : [],
//         sms_stage: 0,
//         next_sms_date: null,
//       };
//       const { error } = addLeadSchema.validate(
//         { ...leadData, user_id: undefined },
//         { abortEarly: false }
//       );
//       if (error) {
//         error.details.forEach((d) =>
//           validationErrors.push(`Row ${leads.length + 2}: ${d.message}`)
//         );
//       } else {
//         leads.push(leadData);
//       }
//     })
//     .on("end", async () => {
//       if (validationErrors.length) {
//         return res.status(400).json({ error: validationErrors.join("; ") });
//       }

//       if (!hasHeaders) {
//         return res
//           .status(400)
//           .json({ error: "CSV file is empty or missing headers." });
//       }

//       if (!leads.length) {
//         return res
//           .status(400)
//           .json({ message: "No valid leads found in the spreadsheet." });
//       }

//       try {
//         // Bulk insert into Supabase
//         const { data, error } = await supabase
//           .from("leads")
//           .insert(leads)
//           .select();

//         if (error) {
//           throw error;
//         }

//         res.status(200).json({
//           message: `${leads.length} leads added successfully.`,
//           leads: data,
//         });
//       } catch (dbError) {
//         if (dbError.code === "23505") {
//           return res.status(409).json({ message: "Email already exists" });
//         }
//         res.status(500).json({ error: dbError.message });
//       }
//     });
// };

// exports.sendTestSMS = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) return res.status(400).json({ error: "Lead ID is required" });

//     // Get lead by ID
//     const { data: lead, error } = await supabase
//       .from("leads")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error || !lead) {
//       return res.status(404).json({ error: "Lead not found" });
//     }
//     const nextStage = lead.sms_stage + 1;
//     res.json({
//       message: `Next stage for ${lead.first_name} is ${nextStage}`,
//       sms_stage: lead.sms_stage,
//       next_stage: nextStage,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// cron.schedule("* * * * *", async () => {
//   console.log("⏰ Running SMS scheduler...");
//   await processPendingSMS();
// });
// // Add a new lead
// exports.addLead = async (req, res) => {
//   const {
//     first_name,
//     last_name,
//     email,
//     phone_number,
//     status,
//     source,
//     type,
//     notes,
//     property_type,
//     budget_range,
//     preferred_location,
//     bedrooms,
//     bathrooms,
//     timeline,
//     social_media,
//     sendEmail,
//   } = req.body;

//   console.log(req.body);

//   try {
//     const phoneNumber = phone_number.startsWith("+91")
//       ? phone_number
//       : `+91${phone_number}`;

//     const { data, error } = await supabase
//       .from("leads")
//       .insert([
//         {
//           user_id: req.user.userId,
//           first_name,
//           last_name,
//           email,
//           phone_number: phoneNumber,
//           status,
//           source,
//           type,
//           notes,
//           property_type,
//           budget_range,
//           preferred_location,
//           bedrooms,
//           bathrooms,
//           timeline,
//           social_media,
//           sms_stage: 0,
//           next_sms_date: null,
//         },
//       ])
//       .select();

//     if (error) {
//       throw error;
//     }

//     const newLead = data[0];
//     const fullName = `${first_name} ${last_name}`;
//     const city = preferred_location || "your city";

//     if (newLead.type?.toLowerCase() === "seller") {
//       await scheduleSellerTexts(newLead); // schedules all stages in DB

//       // scheduleSellerTexts(fullName, phone_number, city);
//       // await triggerRetailAIAgent({ phone: phone_number, name: fullName });
//       // await triggerRetailAIAgent({ phone: phone_number, name: fullName });

//       //   try {
//       //   await triggerRetailAIAgent({ phone: phone_number, name: fullName });
//       //   console.log(" Retail AI call triggered successfully");
//       // } catch (err) {
//       //   console.error(" Error triggering Retail AI call:", err);
//       // }
//     } else {
//       await scheduleBuyerTexts(
//         newLead,
//         newLead.preferred_location || "your city"
//       );
//       // await triggerRetailAIAgent({ phone: phone_number, name: fullName });
//     }

//     if (sendEmail) {
//       if (newLead.type?.toLowerCase() === "seller") {
//         // await initiateSellerWorkflow(newLead.email, newLead.first_name, newLead.last_name);
//       } else {
//         // await initiateBuyerWorkflow(newLead.email, newLead.first_name, newLead.last_name);
//       }
//       //       if (newLead.type?.toLowerCase() === "seller") {
//       //         await sendSellerMail(
//       //           fullName,
//       //           "Welcome to Our Seller Program",
//       //           `It was great connecting with you, ${fullName}.
//       // We’ll guide you through the process of selling your property in ${city} and make sure you get the best possible outcome.
//       // Talk soon!`,
//       //           email,
//       //           "stage 1"
//       //         );
//       //         //first email for buyer
//       //         scheduleSellerLeadEmails(newLead);
//       //       } else {
//       //         await sendMail(
//       //           fullName,
//       //           "Welcome To Real Estate",
//       //           `It was great to meet you, ${fullName}.
//       // We’ll help you find the best property in ${city}.
//       // Talk soon!
//       // Michael K`,
//       //           email,
//       //           "Stage 1"
//       //         );
//       //         scheduleLeadEmails(fullName, email, city);
//       //       }
//       // await triggerRetailAIWebhook({
//       //   name: `${first_name} ${last_name}`,
//       //   phone: phone_number,
//       //   email,
//       //   city: preferred_location || "your city"
//       // });
//     }
//     res
//       .status(201)
//       .json({ message: "Lead added successfully.", lead: data[0] });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all leads

// // Get a single lead by ID

// // Get all leads with pagination, filtering, and search
// exports.getAllLeads = async (req, res) => {
//   const { page = 1, limit = 10, status, source, search } = req.query;
//   const parsedPage = parseInt(page, 10);
//   const parsedLimit = parseInt(limit, 10);

//   const start = (parsedPage - 1) * parsedLimit;
//   const end = start + parsedLimit - 1;

//   try {
//     let query = supabase.from("leads").select("*", { count: "exact" });

//     // Apply filters
//     if (status) {
//       query = query.eq("status", status);
//     }
//     if (source) {
//       query = query.eq("source", source);
//     }

//     // Search across first_name and last_name
//     if (search) {
//       query = query.or(
//         `first_name.ilike.%${search}%,last_name.ilike.%${search}%`
//       );
//     }

//     // Pagination
//     query = query.range(start, end);

//     const { data, count, error } = await query;

//     if (error) {
//       throw error;
//     }

//     res.status(200).json({
//       leads: data,
//       totalLeads: count,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(count / parsedLimit),
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get leads based on status or source (no pagination)
// exports.getFilteredLeads = async (req, res) => {
//   const { status, source } = req.query;

//   try {
//     let query = supabase.from("leads").select("*");

//     // Conditionally apply filters
//     if (status) {
//       query = query.eq("status", status);
//     }
//     if (source) {
//       query = query.eq("source", source);
//     }

//     const { data, error } = await query;

//     if (error) {
//       throw error;
//     }

//     res.status(200).json({ leads: data });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get a single lead by ID
// exports.getLeadById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const { data, error } = await supabase
//       .from("leads")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) {
//       throw error;
//     }

//     if (!data) {
//       return res.status(404).json({ message: "Lead not found." });
//     }

//     res.status(200).json({ lead: data });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.saveFilteredLeadsController = async (req, res) => {
//   const userId = req.user.userId; // Set by authenticateUser middleware
//   const { filters, leadIds, listName } = req.body;

//   if (!Array.isArray(leadIds)) {
//     return res.status(400).json({ message: "leadIds must be an array" });
//   }

//   try {
//     const { data, error } = await supabase.from("saved_leads_lists").insert([
//       {
//         user_id: userId,
//         filters,
//         lead_ids: leadIds,
//         listName,
//       },
//     ]);

//     if (error) {
//       console.error("Supabase insert error:", error);
//       return res.status(500).json({ message: "Failed to save filtered leads" });
//     }

//     return res
//       .status(201)
//       .json({ message: "Filtered leads list saved successfully", data });
//   } catch (err) {
//     console.error("Controller error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
