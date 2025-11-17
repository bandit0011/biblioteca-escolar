import axios from "axios";

// Si existe la variable de entorno VITE_API_URL, úsala. Si no, usa localhost.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: baseURL,
});

// Interceptor para enviar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;