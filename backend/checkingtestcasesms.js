// const twilio = require("twilio");
// require("dotenv").config();

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// async function checkStatus(sid) {
//   try {
//     const message = await client.messages(sid).fetch();
//     console.log(" Delivery Status:", message.status);
//     if (message.errorCode) {
//       console.log(" Error Code:", message.errorCode, "-", message.errorMessage);
//     }
//   } catch (err) {
//     console.error(" Error:", err);
//   }
// }

// checkStatus("SM797f4215957282f31e233f97bbc70db3");//your SM number that u r going to recive on sending thest case file so tht u can conform the status 
// //run this exact file after getting SM from testCase