// const Joi = require('joi');

// const addLeadSchema = Joi.object({
//   // user_id: Joi.number().integer().required(),

//   first_name: Joi.string().trim().required(),
//   last_name: Joi.string().trim().required(),
//   email: Joi.string().email().required(),
//   phone_number: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),

//   status: Joi.string().trim().allow('').optional(),
//   source: Joi.string().trim().allow('').optional(),
//   type: Joi.string().trim().allow('').optional(),
//   notes: Joi.string().trim().allow('').optional(),

//   property_type: Joi.string().trim().allow('').optional(),
//   budget_range: Joi.string().trim().allow('').optional(),
//   preferred_location: Joi.string().trim().allow('').optional(),

//   bedrooms: Joi.number().integer().allow('').optional(),
//   bathrooms: Joi.number().integer().allow('').optional(),

//   timeline: Joi.string().trim().allow('').optional(),

//   property_address: Joi.string().trim().allow('').optional(),
//   motivation: Joi.string().trim().allow('').optional(),
//   selling_timeline: Joi.string().trim().allow('').optional(),
//   square_footage: Joi.string().trim().allow('').optional(),
//   property_condition: Joi.string().trim().allow('').optional(),
//   renovations: Joi.string().trim().allow('').optional(),
//   current_owe: Joi.string().trim().allow('').optional(),
//   other_debts: Joi.string().trim().allow('').optional(),
//    property_value: Joi.string().trim().allow('').optional(),
//   estimated_value: Joi.string().trim().allow('').optional(),
//   best_visit_time: Joi.string().trim().allow('').optional(),
//   referral_source: Joi.string().trim().allow('').optional(),
//   additional_notes: Joi.string().trim().allow('').optional(),

//   // social_media only allowed for Buyer or Investor
//   social_media: Joi.array().items(
//     Joi.object({
//       platform: Joi.string().allow('').optional(),
//       handle: Joi.string().allow('').optional()
//     })
//   ).default([]),

//   sendEmail: Joi.boolean().required()
// });


// module.exports = {
//   addLeadSchema
// };
