import axios from "axios";

const API_URL = "https://localhost:7007/api/auth"; // Use HTTPS endpoint; adjust if using HTTP

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export const signup = async (data) => {
  const response = await api.post("/signup", data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/login", data);
  return response.data;
};

export const requestPasswordReset = async (data) => {
  const response = await api.post("/reset-password-request", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/reset-password", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await api.post("/verify-email", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/current-user");
  return response.data;
};

export default api;