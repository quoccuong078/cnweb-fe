import axios from "axios";

const API_URL = "https://localhost:7007";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request: Adding token to", config.url);
    } else {
      console.log("API Request: No token found for", config.url);
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.config.url, error.response?.status);
    if (error.response?.status === 401) {
      const isLoginRequest = error.response.config.url.includes("/login");
      console.log("API 401 Error: isLoginRequest=", isLoginRequest);
      if (isLoginRequest) {
        return Promise.reject(error);
      }
      console.log("API 401: Triggering redirect to /auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export const signup = async (data) => {
  const response = await api.post("/api/auth/signup", {
    CompanyName: data.CompanyName,
    Email: data.Email,
    Password: data.Password,
    ContactName: data.ContactName,
    PhoneNumber: data.PhoneNumber,
    Subdomain: data.Subdomain,
    PlanId: data.PlanId, // <--- THÊM DÒNG NÀY ĐỂ GỬI GÓI ĐÃ CHỌN
  });
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const requestPasswordReset = async (data) => {
  const response = await api.post("/api/auth/reset-password-request", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/api/auth/reset-password", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  console.log("verifyEmail: Sending request with data:", data);
  const response = await api.post("/api/auth/verify-email", data);
  console.log("verifyEmail: Response:", response.data);
  return response.data;
};

export const getCurrentUser = async () => {
  console.log("getCurrentUser: Sending request");
  const response = await api.get("/api/auth/current-user");
  console.log("getCurrentUser: Response:", response.data);
  return response.data;
};

export const getMyLandings = async () => {
  const response = await api.get("/api/tenant/landings");
  return response.data;
};

export const getLandingForEdit = async (pageId) => {
  const response = await api.get(`/api/tenant/landings/${pageId}`);
  return response.data;
};

// Thêm hàm upload ảnh
export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  // Content-Type phải để axios tự set khi dùng FormData
  const response = await api.post("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.url; // Trả về URL ảnh từ server
};

// Tạo trang mới
export const createLanding = async (data) => {
  const response = await api.post("/api/tenant/landings", data);
  return response.data;
};

// Cập nhật trang
export const updateLanding = async (pageId, data) => {
  const response = await api.put(`/api/tenant/landings/${pageId}`, data);
  return response.data;
};

export const getPublicPlans = async () => {
  const response = await api.get("/api/plans");
  return response.data;
};

export const getCurrentSubscription = async () => {
  const response = await api.get("/api/subscription/current");
  return response.data;
};

export const changePlan = async (newPlanId) => {
  const response = await api.post("/api/subscription/change-plan", { NewPlanId: newPlanId });
  return response.data;
};

export default api;