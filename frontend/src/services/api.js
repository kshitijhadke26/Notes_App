import axios from "axios";

// FastAPI backend URL
const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

// Attach token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
