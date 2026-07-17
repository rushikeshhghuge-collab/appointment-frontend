import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://your-backend.onrender.com/api
});

// Attach JWT to every request automatically - fixes the classic
// "forgot to add the auth header on this one component" bug
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
