import axios from 'axios';

const instance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
   //baseURL: "http://localhost:5001/",
  baseURL: 'https://invoice-analyser-6uzd.onrender.com',
  headers: {
    'Content-Type': 'application/json' 
  }
});

export default instance;
