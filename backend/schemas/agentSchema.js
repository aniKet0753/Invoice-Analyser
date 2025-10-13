// const Joi = require('joi');

// const signupSchema = Joi.object({
//     first_name: Joi.string()
//         .trim()
//         .required()
//         .messages({
//             'string.empty': 'Please enter your first name.',
//             'any.required': 'First name is a required field.'
//         }),
//     last_name: Joi.string()
//         .trim()
//         .required()
//         .messages({
//             'string.empty': 'Please enter your last name.',
//             'any.required': 'Last name is a required field.'
//         }),
//     email: Joi.string()
//         .email()
//         .required()
//         .messages({
//             'string.empty': 'Email address cannot be empty.',
//             'string.email': 'Please enter a valid email address.',
//             'any.required': 'Email is a required field.'
//         }),
//     phone_number: Joi.string()
//         .pattern(/^[0-9]{10,15}$/)
//         .required()
//         .messages({
//             'string.empty': 'Phone number cannot be empty.',
//             'string.pattern.base': 'Please enter a valid phone number (10-15 digits).',
//             'any.required': 'Phone number is a required field.'
//         }),
//     password: Joi.string()
//         .min(8)
//         .required()
//         .messages({
//             'string.min': 'Password must be at least 8 characters long.',
//             'string.empty': 'Password cannot be empty.',
//             'any.required': 'Password is a required field.'
//         }),
//     company_name: Joi.string()
//         .trim()
//         .required()
//         .messages({
//             'string.empty': 'Company name cannot be empty.',
//             'any.required': 'Company name is a required field.'
//         }),
//     address: Joi.string()
//         .trim()
//         .required()
//         .messages({
//             'string.empty': 'Address cannot be empty.',
//             'any.required': 'Address is a required field.'
//         }),
//     state: Joi.string()
//         .trim()
//         .required()
//         .messages({
//             'string.empty': 'State cannot be empty.',
//             'any.required': 'State is a required field.'
//         }),
//     city: Joi.string()
//         .trim()
//         .required()
//         .messages({
//             'string.empty': 'City cannot be empty.',
//             'any.required': 'City is a required field.'
//         }),
// });

// // const Joi = require('joi');

// const loginSchema = Joi.object({
//     emailOrPhone: Joi.alternatives()
//         .try(
//             Joi.string()
//                 .email()
//                 .messages({
//                     'string.email': 'Please enter a valid email address.',
//                 }),
//             Joi.string()
//                 .pattern(/^[0-9]{10,15}$/)
//                 .messages({
//                     'string.pattern.base': 'Please enter a valid phone number.',
//                 })
//         )
//         .required()
//         .messages({
//             'any.required': 'Email or phone number is a required field.',
//             'alternatives.match': 'The input must be a valid email or phone number.'
//         }),
//     password: Joi.string()
//         .required()
//         .messages({
//             'string.empty': 'Password cannot be empty.',
//             'any.required': 'Password is a required field.'
//         }),
// });

// module.exports = {
//     loginSchema,
//     signupSchema
// };