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
//   minutesLater: 0,
//     text: (name) => `Hi ${name}, it was great speaking with you!
// I specialize in helping homeowners like you sell quickly and for top dollar. 
// Please save my contact info. Looking forward to working together!
// – Michael`,
//   },
//   {
//     stage: 2,
//     minutesLater: 1,
//     text: (name) =>
//       `Hi ${name}, I just sent you an email about the 3 keys to selling for top dollar. Can you check and tell me what you think? . – Michael`,
//   },
//   {
//     stage: 3,
//     minutesLater: 2,
//     text: (name) =>
//       `Hi ${name}, did you get my email about finding out what your home is worth today?. – Michael`,
//   },
//   {
//     stage: 4,
//     minutesLater: 3,
//     text: (name) =>
//       `Hi ${name}, I sent you an email outlining the 3 keys to selling fast and for more. Can you confirm you saw it?. – Michael`,
//   },
//   {
//     stage: 5,
//     minutesLater: 4,
//     text: (name) =>
//       `Hi ${name}, I just emailed you details about how I market homes beyond a yard sign. Did you see it in your inbox?. – Michael`,
//   },
//   {
//     stage: 6,
//     minutesLater: 5,
//     text: (name) =>
//       `Hi ${name}, I sent you a Home Value Report about timing the market to maximize your sale. Did it come through? .– Michael`,
//   },
//   {
//     stage: 7,
//    minutesLater: 6,
//     text: (name) =>
//       `Hi ${name}, I emailed you about the 3 biggest mistakes sellers make. Can you take a look and tell me what you think. – Michael?`,
//   },
//   {
//     stage: 8,
//     minutesLater: 7,
//     text: (name) =>
//       `Hi ${name}, I just emailed you about cashing out on your equity while demand is strong. Did you see it yet?. – Michael`,
//   },
// ];
// function normalizePhone(phone) {
//   if (!phone.startsWith("+91")) return `+91${phone.replace(/^0+/, "")}`;
//   return phone;
// }
// // function getNextDate(baseDate, daysLater) {
// //   const date = new Date(baseDate);
// //   date.setDate(date.getDate() + daysLater);
// //   return date; // Always store ISO string for Supabase
// // }
// //SMS Sender
// async function sendSMSViaTwilio(to, body) {
//   const message = await client.messages.create({
//     body,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to,
//   });
//   return message.sid;
// }

// async function scheduleSellerTexts(lead) {
//   const normalizedPhone = normalizePhone(lead.phone_number);
//   const now = new Date();

//   for (const stageObj of STAGES) {
//     const sendAt = new Date(now.getTime() + stageObj.minutesLater * 60000);
//     await supabase.from("lead_sms2").insert({
//       lead_id: lead.id,
//       stage: stageObj.stage,
//       send_at: sendAt.toISOString(),
//       status: "pending",
//     });
//     console.log(`📆 Scheduled Stage ${stageObj.stage} SMS for ${normalizedPhone} at ${sendAt}`);
//   }
// }
// async function processPendingSMS() {
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
// module.exports = { scheduleSellerTexts, processPendingSMS, STAGES };