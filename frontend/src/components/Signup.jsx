// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from '../api';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaEye, FaEyeSlash, FaShieldAlt, FaPlusCircle, FaHeadset, FaSearch, FaChevronDown, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

// // Import dynamic selection components
// import { StateSelect, CitySelect } from 'react-country-state-city';
// // import 'react-country-state-city/dist/react-country-state-city.css';

// // Set the Country ID for the United States
// const US_COUNTRY_ID = 233;

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone_number: '',
//     company_name: '',
//     address: '',
//     city: '',
//     cityid: '', // Added for the City component
//     state: '',
//     stateid: '', // Added for the State component
//     password: '',
//     confirmPassword: '',
//     terms: false,
//     communications: false,
//   });


//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState('Weak');
//   const [passwordValidation, setPasswordValidation] = useState({
//     length: false,
//     lowercase: false,
//     uppercase: false,
//     number: false,
//     specialChar: false,
//   });
//   const [validationErrors, setValidationErrors] = useState({});


//   // OTP state
//   const [showOtpPopup, setShowOtpPopup] = useState(false);
//   const [emailCode, setEmailCode] = useState(['', '', '', '', '', '']);
//   const inputRefs = useRef([]);
//   const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);
//   const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);
//   const [isSendingOtp, setIsSendingOtp] = useState(false);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
//   const [emailTimer, setEmailTimer] = useState(0);
//   const [phoneTimer, setPhoneTimer] = useState(0);
//   const [otpErrors, setOtpErrors] = useState({ email: '', phone: '' });
//   const [finalSubmitError, setFinalSubmitError] = useState('');

  
//   // Check password strength and validation rules
//   const checkPasswordValidation = (password) => {
//     const rules = {
//       length: password.length >= 8,
//       lowercase: /[a-z]/.test(password),
//       uppercase: /[A-Z]/.test(password),
//       number: /[0-9]/.test(password),
//       specialChar: /[^a-zA-Z0-9]/.test(password),
//     };
//     setPasswordValidation(rules);


//     let strength = Object.values(rules).filter(Boolean).length;

//     switch (strength) {
//       case 0:
//       case 1:
//       case 2:
//         return 'Weak';
//       case 3:
//         return 'Medium';
//       case 4:
//       case 5:
//         return 'Strong';
//       default:
//         return 'Weak';
//     }
//   };


//   // Handle input changes, now with phone number length enforcement
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let newValue = type === 'checkbox' ? checked : value;


//     // Limit phone number to 10 characters
//     if (name === 'phone_number') {
//       if (newValue.length > 10) {
//         return; // Do not update state if the value is more than 10 characters
//       }
//     }


//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));


//     if (name === 'password') {
//       setPasswordStrength(checkPasswordValidation(newValue));
//     }


//     // Clear validation error on change
//     if (validationErrors[name]) {
//       setValidationErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };


//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };


//   // NEW: Handlers for dynamic State and City dropdowns
//   const handleStateChange = (state) => {
//     setFormData(prev => ({
//       ...prev,
//       state: state ? state.name : '',
//       stateid: state ? state.id : '',
//       city: '', // Reset city when state changes
//       cityid: '',
//     }));
//     setValidationErrors(prev => ({ ...prev, stateid: '', city: '' }));
//   };

//   const handleCityChange = (city) => {
//     setFormData(prev => ({
//       ...prev,
//       city: city ? city.name : '',
//       cityid: city ? city.id : '',
//     }));
//     setValidationErrors(prev => ({ ...prev, city: '' }));
//   };


//   // Email verification code timer
//   useEffect(() => {
//     if (emailTimer > 0) {
//       const timerId = setInterval(() => {
//         setEmailTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timerId);
//     }
//   }, [emailTimer]);


//   // Phone verification code timer
//   useEffect(() => {
//     if (phoneTimer > 0) {
//       const timerId = setInterval(() => {
//         setPhoneTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timerId);
//     }
//   }, [phoneTimer]);


//   const handleSendOtp = async (type) => {
//     setIsSendingOtp(true);
//     setOtpErrors({ email: '', phone: '' });
//     try {
//       if (type === 'email') {
//         await axios.post('/api/otp/send-otp', { identifier: formData.email , type: 'email'});
//         toast.success('Email verification code sent.');
//         setEmailTimer(30);
//       } else if (type === 'phone') {
//         await axios.post('/api/otp/send-otp', { identifier: formData.phone_number, type: 'phone_number' });
//         toast.success('Phone verification code sent.');
//         setPhoneTimer(30);
//       }
//     } catch (err) {
//       console.error(`Failed to send ${type} verification code:`, err);
//       setOtpErrors(prev => ({ ...prev, [type]: `${err.response?.data?.error || 'An error occurred'}` }));
//     } finally {
//       setIsSendingOtp(false);
//     }
//   };


//   const handleVerifyOtp = async (type, codeArray = null) => {
//     setIsVerifyingOtp(true);
//     setOtpErrors({ email: '', phone: '' });

//     try {
//         const code = codeArray || (type === 'email' ? emailCode : null);

//         if (!code || code.some(digit => digit === '')) {
//             setOtpErrors(prev => ({ ...prev, [type]: 'Please enter all 6 digits.' }));
//             setIsVerifyingOtp(false);
//             return;
//         }

//         const verificationCode = code.join('');

//         const payload = { 
//             identifier: type === 'email' ? formData.email : formData.phone_number, 
//             otp: verificationCode 
//         };
//         await axios.post('/api/otp/verify-otp', payload);

//         if (type === 'email') {
//             setIsEmailOtpVerified(true);
//             toast.success('Email verification code verified!');
//         } else {
//             setIsPhoneOtpVerified(true);
//             toast.success('Phone verification code verified!');
//         }

//     } catch (err) {
//         console.error(`Verification failed for ${type}:`, err);
//         setOtpErrors(prev => ({ ...prev, [type]: `Invalid verification code. Please try again.` }));
//     } finally {
//         setIsVerifyingOtp(false);
//     }
//   };


//   const handleOpenOtpModal = (e) => {
//     e.preventDefault();

//     let errors = {};
//     const requiredFields = ['first_name', 'last_name', 'email', 'phone_number', 'company_name', 'address', 'stateid', 'cityid', 'password', 'confirmPassword'];
    
//     requiredFields.forEach(field => {
//       // Use stateid and cityid for validation
//       if (!formData[field]) {
//         const fieldName = (field === 'stateid' ? 'state' : (field === 'cityid' ? 'city' : field));
//         errors[fieldName] = 'This field is required.';
//       }
//     });

//     if (formData.phone_number && formData.phone_number.length !== 10) {
//       errors.phone_number = 'Phone number must be exactly 10 digits.';
//     }

//     if (formData.password !== formData.confirmPassword) {
//       errors.password = 'Passwords do not match.';
//       errors.confirmPassword = 'Passwords do not match.';
//     }

//     if (!Object.values(passwordValidation).every(Boolean)) {
//       errors.password = 'Please meet all password requirements.';
//     }

//     if (!formData.terms) {
//       errors.terms = 'You must agree to the Terms of Service.';
//     }

//     setValidationErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       return;
//     }

//     handleSendOtp('email');
//     setShowOtpPopup(true);
//   };


//   const handleCloseOtpModal = () => {
//     setShowOtpPopup(false);
//     setEmailCode(['', '', '', '', '', '']);
//     setIsEmailOtpVerified(false);
//     setOtpErrors({ email: '', phone: '' });
//     setFinalSubmitError('');
//     setEmailTimer(0);
//     setPhoneTimer(0);
//   };
  
//   const handleFinalSubmit = async (e) => {
//     e.preventDefault();
//     setFinalSubmitError('');

//     if (!isEmailOtpVerified) {
//       setFinalSubmitError("Please verify email verification code first.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const { confirmPassword, terms, communications, cityid, stateid, ...payload } = formData;
//       // Send city and state names, exclude cityid and stateid
//       payload.city = formData.city;
//       payload.state = formData.state;
//       await axios.post('/api/agents/signup', payload);
//       toast.success('Successfully registered your account!', { autoClose: 3000 });
//       setTimeout(() => navigate('/login'), 4000);
//     } catch (err) {
//       console.error('Registration failed:', err);
//       setFinalSubmitError(`Registration failed: ${err.response?.data?.error || 'An unknown error occurred.'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleCodeChange = (e, index) => {
//     const { value } = e.target;
//     const newCode = [...emailCode];
//     newCode[index] = value.slice(-1);
//     setEmailCode(newCode);

//     if (value && index < 5) {
//         inputRefs.current[index + 1].focus();
//     }

//     if (newCode.every(digit => digit)) {
//         handleVerifyOtp('email', newCode);
//     }
//   };


//   const handleCodeKeyDown = (e, index) => {
//     if (e.key === 'Backspace' && !emailCode[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };


//   return (
//     <div className={`flex flex-col items-center justify-center bg-[#121212] text-white font-sans ${showOtpPopup ? 'filter backdrop-blur-sm' : ''}`}>
//       <ToastContainer style={{ zIndex: 9999 }} />
//       <div className="flex flex-col items-center p-4 w-full h-full justify-center">
//         <h1 className="text-4xl font-bold mb-10">
//           <span className="text-white">AGENTS</span><span className="text-[#96a099]">UIT</span>
//         </h1>
        
//         <div className="bg-[#1e1e1e] p-8 md:p-12 rounded-lg shadow-lg max-w-2xl w-full">
//           <h2 className="text-2xl font-semibold text-center mb-2">Create Your Account</h2>
//           <p className="text-gray-400 text-center text-sm mb-6">Join Agentsuit and transform your lead management</p>
          
//           <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">First Name</label>
//               <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.first_name ? 'border-2 border-red-500' : ''}`} placeholder="Enter your first name" required/>
//               {validationErrors.first_name && <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>}
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">Last Name</label>
//               <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.last_name ? 'border-2 border-red-500' : ''}`} placeholder="Enter your last name" required/>
//               {validationErrors.last_name && <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>}
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">Email Address</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.email ? 'border-2 border-red-500' : ''}`} placeholder="Enter your email address" required/>
//               {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
//               <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.phone_number ? 'border-2 border-red-500' : ''}`} placeholder="Enter your phone number" maxLength="10" required/>
//               {validationErrors.phone_number && <p className="text-red-500 text-sm mt-1">{validationErrors.phone_number}</p>}
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-400 mb-1">Company Name</label>
//               <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.company_name ? 'border-2 border-red-500' : ''}`} placeholder="Enter your company name" required/>
//               {validationErrors.company_name && <p className="text-red-500 text-sm mt-1">{validationErrors.company_name}</p>}
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-400 mb-1">Address</label>
//               <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.address ? 'border-2 border-red-500' : ''}`} placeholder="Enter your address" required/>
//               {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
//             </div>

//             {/* MODIFIED: State and City Selectors */}
//             <div className="dynamic-select-wrapper">
//               <label className="block text-sm text-gray-400 mb-1">State</label>
//               <StateSelect
//                 countryid={US_COUNTRY_ID}
//                 onChange={handleStateChange}
//                 placeHolder="Select State"
//                 inputClassName="w-full bg-[#2c2c2c]  text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600"
//                 value={formData.stateid}
//               />
              
//               {validationErrors.state && <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>}
//             </div>

//             <div className="dynamic-select-wrapper">
//               <label className="block text-sm text-gray-400 mb-1">City</label>
//               <CitySelect
//                 name='city'
//                 countryid={US_COUNTRY_ID}
//                 stateid={formData.stateid}
//                 onChange={handleCityChange}
//                 placeHolder="Select City"
//                 value={formData.cityid}
//                 disabled={!formData.stateid}
                
//                 inputClassName="w-full bg-[#2c2c2c] text-white rounded-md p-3 
//                   focus:outline-none focus:ring-2 focus:ring-yellow-600"
//               />
//               {validationErrors.city && <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>}
//             </div>

//             {/* CSS to fix dropdown background and text color */}
//             <style jsx global>{`
            
//               .stdropdown-menu {
//                 position: absolute;
//                 transform: translateY(4px);
//                 width: 100%;
//                 border: 1px solid #ccc;
//                 border-radius: 5px;
//                 overflow: auto;
//                 max-height: 150px;
//                 background-color: #060606ff;
//                 z-index: 99;
//               }
//               .dynamic-select-wrapper .select {
//                 background-color: #2c2c2c !important;
//                 color: white !important;
//                 border-radius: 0.375rem;
//                 padding: 0.75rem;
//                 border: none;
//                 width: 100%;
//               }
//               .dynamic-select-wrapper .select:focus {
//                 outline: none;
//                 box-shadow: 0 0 0 2px #d97706 !important; /* Corresponds to focus:ring-yellow-600 */
//               }
//               .dynamic-select-wrapper .list,
//               .dynamic-select-wrapper .list-item {
//                 background-color: #2c2c2c !important;
//                 color: white !important;
//                 border: 1px solid #3c3c3c;
//               }
//               .dynamic-select-wrapper .list-item:hover {
//                 background-color: #3c3c3c !important;
//                 color: white !important;
                
//               }
//             `}</style>
            
//             <div className="col-span-1 md:col-span-1">
//               <label className="block text-sm text-gray-400 mb-1">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10 ${validationErrors.password ? 'border-2 border-red-500' : ''}`}
//                   placeholder="Create a strong password"
//                   required/>
//                 <span
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? (
//                     <FaEyeSlash className="w-4 h-4" />
//                   ) : (
//                     <FaEye className="w-4 h-4" />
//                   )}
//                 </span>
//               </div>
//               {formData.password && (
//                 <div className="mt-2 flex flex-col space-y-2">
//                   <div className="flex items-center">
//                     <div className="flex-1 bg-gray-600 h-2 rounded-full overflow-hidden">
//                       <div className={`h-full rounded-full transition-all duration-300
//                         ${passwordStrength === 'Strong' ? 'bg-green-500 w-full' : passwordStrength === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}
//                       `}></div>
//                     </div>
//                     <span className={`ml-2 text-xs font-semibold
//                       ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}
//                     `}>
//                       {passwordStrength}
//                     </span>
//                   </div>
//                   <ul className="text-gray-400 text-xs">
//                     <li className={`flex items-center ${passwordValidation.length ? 'text-green-500' : ''}`}>
//                       {passwordValidation.length ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
//                       At least 8 characters long
//                     </li>
//                     <li className={`flex items-center ${passwordValidation.lowercase && passwordValidation.uppercase ? 'text-green-500' : ''}`}>
//                       {passwordValidation.lowercase && passwordValidation.uppercase ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
//                       Includes uppercase and lowercase letters
//                     </li>
//                     <li className={`flex items-center ${passwordValidation.number ? 'text-green-500' : ''}`}>
//                       {passwordValidation.number ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
//                       Includes a number
//                     </li>
//                     <li className={`flex items-center ${passwordValidation.specialChar ? 'text-green-500' : ''}`}>
//                       {passwordValidation.specialChar ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
//                       Includes a special character
//                     </li>
//                   </ul>
//                 </div>
//               )}
//               {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
//             </div>
//             <div className="col-span-1 md:col-span-1">
//               <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10 ${validationErrors.confirmPassword ? 'border-2 border-red-500' : ''}`}
//                   placeholder="Confirm your password"
//                   required
//                 />
//                 <span
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? (
//                     <FaEyeSlash className="w-4 h-4" />
//                   ) : (
//                     <FaEye className="w-4 h-4" />
//                   )}
//                 </span>
//               </div>
//               {validationErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>}
//             </div>


//             <div className="flex items-center mt-4 col-span-full">
//               <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} className={`mr-2 accent-yellow-600 ${validationErrors.terms ? 'border-2 border-red-500' : ''}`} required />
//               <label htmlFor="terms" className="text-gray-400 text-sm">
//                 I agree to Agentsuit's <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>
//               </label>
//             </div>
//             {validationErrors.terms && <p className="text-red-500 text-sm col-span-full">{validationErrors.terms}</p>}


//             <div className="flex items-center col-span-full">
//               <input type="checkbox" id="communications" name="communications" checked={formData.communications} onChange={handleChange} className="mr-2 accent-yellow-600" />
//               <label htmlFor="communications" className="text-gray-400 text-sm">
//                 Send me product updates and marketing communications
//               </label>
//             </div>


//             <button
//               type="button"
//               onClick={handleOpenOtpModal}
//               disabled={isLoading}
//               className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition-colors mt-4 col-span-full disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Create Account
//             </button>
//           </form>


//           <div className="flex items-center my-6">
//             <hr className="flex-1 border-gray-700" />
//             <span className="mx-4 text-gray-500 text-sm">or</span>
//             <hr className="flex-1 border-gray-700" />
//           </div>
          
//           <div className="text-center text-gray-500 text-sm">
//             Already have an account? <a href="#" className="text-white hover:underline" onClick={() => navigate('/login')}>Sign in</a>
//           </div>
//         </div>


//         <div className="flex justify-center space-x-4 mt-10">
//           <div className="flex flex-col items-center bg-[#1e1e1e] border border-gray-700 p-4 rounded-lg w-32">
//             <FaShieldAlt className="w-10 h-10 mb-2 text-gray-400" />
//             <span className="text-sm font-semibold text-white">Secure</span>
//             <span className="text-xs text-gray-400 text-center">Bank-level security</span>
//           </div>
//           <div className="flex flex-col items-center bg-[#1e1e1e] border border-gray-700 p-4 rounded-lg w-32">
//             <FaPlusCircle className="w-10 h-10 mb-2 text-gray-400" />
//             <span className="text-sm font-semibold text-white">24/7 Access</span>
//             <span className="text-xs text-gray-400 text-center">Always available</span>
//           </div>
//           <div className="flex flex-col items-center bg-[#1e1e1e] border border-gray-700 p-4 rounded-lg w-32">
//             <FaHeadset className="w-10 h-10 mb-2 text-gray-400" />
//             <span className="text-sm font-semibold text-white">Support</span>
//             <span className="text-xs text-gray-400 text-center">Expert assistance</span>
//           </div>
//         </div>


//       </div>
      
//       <div className="w-full text-center text-gray-500 text-xs py-4">
//         © 2025 Kuber Ventures LLC. All rights reserved.
//         <span className="mx-2">|</span>
//         <a href="#" className="hover:underline">Privacy Policy</a>
//         <span className="mx-2">|</span>
//         <a href="#" className="hover:underline">Terms of Service</a>
//         <span className="mx-2">|</span>
//         <a href="#" className="hover:underline">Help Center</a>
//         <span className="mx-2">|</span>
//         <a href="#" className="hover:underline">Contact Support</a>
//       </div>


//       {showOtpPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm position-relative top-20">
//           <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-xl w-full max-w-sm text-white relative" style={{position: "absolute", top: "5%"}}>
//             <button onClick={handleCloseOtpModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
//               <FaTimes size={20} />
//             </button>
//             <h3 className="text-xl font-semibold text-center mb-4">Verify Your Account</h3>
//             <p className="text-gray-400 text-sm text-center mb-6">
//               A verification code has been sent to your email.
//             </p>


//             <div className="space-y-4 mb-6">
//               <label className="block text-sm text-gray-400">Email Verification Code</label>
//               <div className="flex justify-between space-x-2">
//                 {Array(6).fill(null).map((_, index) => (
//                   <input
//                     key={index}
//                     type="tel"
//                     maxLength="1"
//                     value={emailCode[index]}
//                     onChange={(e) => handleCodeChange(e, index)}
//                     onKeyDown={(e) => handleCodeKeyDown(e, index)}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     className={`w-1/6 text-center bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${isEmailOtpVerified ? 'bg-green-600' : ''}`}
//                     disabled={isEmailOtpVerified || isVerifyingOtp}
//                   />
//                 ))}
//               </div>
//               {otpErrors.email && <p className="text-red-500 text-sm mt-1">{otpErrors.email}</p>}
//               <div className="flex justify-between text-xs text-gray-400">
//                 <span>Resend verification code in {emailTimer}s</span>
//                 <button
//                   onClick={() => handleSendOtp('email')}
//                   disabled={emailTimer > 0 || isSendingOtp}
//                   className={`text-yellow-600 hover:underline ${emailTimer > 0 || isSendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Resend
//                 </button>
//               </div>
//             </div>


//             <button
//               type="button"
//               onClick={handleFinalSubmit}
//               disabled={!isEmailOtpVerified || isLoading}
//               className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Proceed and Create Account
//             </button>
//             {finalSubmitError && <p className="text-red-500 text-sm text-center mt-2">{finalSubmitError}</p>}
//           </div>
//         </div>
//       )}

//       {/* Optional: Add custom styles to your global CSS or here to match your theme */}
//       <style jsx global>{`
//         .dynamic-select-wrapper .select {
//           background-color: #2c2c2c;
//           color: white;
//           border-radius: 0.375rem;
//           padding: 0.75rem;
//           border: none;
//           width: 100%;
//         }
//         .dynamic-select-wrapper .select:focus {
//           outline: none;
//           box-shadow: 0 0 0 2px #d97706; /* Corresponds to focus:ring-yellow-600 */
//         }
//         .dynamic-select-wrapper .list {
//           background-color: #2c2c2c;
//           color: white;
//           border: 1px solid #3c3c3c;
//         }
//         .dynamic-select-wrapper .list-item:hover {
//           background-color: #3c3c3c;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SignupPage;
