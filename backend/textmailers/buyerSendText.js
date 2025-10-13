// require("dotenv").config();
// const twilio = require("twilio");
// const supabase = require("../db/supabaseClient");
// const cron = require("node-cron");

// const client = new twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const STAGES = [
//   {
//     stage: 1,
//     minutesLater: 0,
//     text: (name) =>
//       `Hi ${name}, it was a pleasure meeting you! Please save my contact info.`,
//   },
//   {
//     stage: 2,
//     minutesLater: 1,
//     text: (name) =>
//       `Hi ${name}, just sent you an email with a 3-step roadmap for buying your home. Thoughts?`,
//   },
//   {
//     stage: 3,
//     minutesLater: 2,
//     text: (name, city) =>
//       `Hi ${name}, sent you the latest ${city} market update. Did you get it?`,
//   },
//   {
//     stage: 4,
//     minutesLater: 3,
//     text: (name) => `Check your inbox: financing & pre-approval info.`,
//   },
//   {
//     stage: 5,
//     minutesLater: 4,
//     text: (name) =>
//       `I emailed you insider info about accessing homes before Zillow. Did you see it?`,
//   },
//   {
//     stage: 6,
//     minutesLater: 5,
//     text: (name) =>
//       `Sent email about 3 costly mistakes buyers make. Worth a read.`,
//   },
//   {
//     stage: 7,
//     minutesLater: 6,
//     text: (name) => `Just emailed you about custom searches. Did it land?`,
//   },
//   {
//     stage: 8,
//     minutesLater: 7,
//     text: (name) =>
//       `Check your email about making your next move toward homeownership.`,
//   },
// ];

// function normalizePhone(phone) {
//   if (!phone.startsWith("+91")) return `+91${phone.replace(/^0+/, "")}`;
//   return phone;
// }

// // SMS sender
// async function sendSMSViaTwilio(to, body, leadId, stage) {
//   try {
//     const message = await client.messages.create({
//       body,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to,
//     });
//     console.log(
//       ` Lead ${leadId}, Stage ${stage} → Twilio accepted, SID: ${message.sid}`
//     );
//     return message.sid;
//   } catch (err) {
//     console.error(
//       ` Error sending SMS for lead ${leadId}, stage ${stage}:`,
//       err.message
//     );
//     throw err;
//   }
// }

// // Schedule all stages for a buyer
// async function scheduleBuyerTexts(lead, city) {
//   const normalizedPhone = normalizePhone(lead.phone_number);
//   const now = new Date();

//   for (const stageObj of STAGES) {
//     const sendAt = new Date(now.getTime() + stageObj.minutesLater * 60000); //custmizw asu want time gap
//     await supabase.from("lead_sms2").insert({
//       lead_id: lead.id,
//       stage: stageObj.stage,
//       send_at: sendAt.toISOString(),
//       status: "pending",
//       city: city || null,
//     });
//     console.log(
//       ` Scheduled Stage ${stageObj.stage} SMS for ${normalizedPhone} at ${sendAt}`
//     );
//   }
// }

// // Process pending buyer SMS
// async function processPendingBuyerSMS() {
//   console.log(" Running Buyer SMS scheduler...");
//   const { data: pendingSMS } = await supabase
//     .from("lead_sms2")
//     .select("*")
//     .eq("status", "pending")
//     .lte("send_at", new Date().toISOString());

//   if (!pendingSMS || !pendingSMS.length) return;
// await Promise.all(
//   pendingSMS.map(async (sms) => {
//     try {
//       const { data: lead } = await supabase
//         .from("leads")
//         .select("*")
//         .eq("id", sms.lead_id)
//         .single();

//       if (!lead || !lead.phone_number) {
//         console.error(`❌ Lead ${sms.lead_id} has no phone number. Skipping SMS.`);
//         await supabase
//           .from("lead_sms2") // or buyer_sms
//           .update({ status: "failed", updated_at: new Date().toISOString() })
//           .eq("id", sms.id);
//         return;
//       }

//       const normalizedPhone = normalizePhone(lead.phone_number);
//       const stageText =
//         sms.stage === 3
//           ? STAGES[sms.stage - 1].text(lead.first_name, sms.city)
//           : STAGES[sms.stage - 1].text(lead.first_name);

//       const sid = await sendSMSViaTwilio(
//         normalizedPhone,
//         stageText,
//         lead.id,
//         sms.stage
//       );

//       await supabase
//         .from("lead_sms2")
//         .update({
//           status: "sent",
//           twilio_sid: sid,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", sms.id);

//       console.log(`✅ SMS sent for lead ${lead.id}, stage ${sms.stage}`);
//     } catch (err) {
//       console.error(`❌ Error sending SMS for lead ${sms.lead_id}, stage ${sms.stage}:`, err.message);
//     }
//   })
// );
// }
// cron.schedule("* * * * *", () => {
//   processPendingBuyerSMS().catch((err) =>
//     console.error("❌ Buyer SMS scheduler error:", err)
//   );
// });
// module.exports = { scheduleBuyerTexts, processPendingBuyerSMS, STAGES };
