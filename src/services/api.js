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

// --- PLAN MANAGEMENT (SUPER ADMIN) ---
export const getAllSubscriptions = async () => {
  const response = await api.get("/api/plans/subscriptions");
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await api.post("/api/plans", planData);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await api.put(`/api/plans/${id}`, planData);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await api.delete(`/api/plans/${id}`);
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post("/api/auth/change-password", {
    OldPassword: oldPassword,
    NewPassword: newPassword
  });
  return response.data;
};

// Thêm vào file api.js

export const updateUser = async (id, data) => {
  // data bao gồm: { ContactName, Email, PhoneNumber, Avatar, ... }
  const response = await api.put(`/api/user/${id}`, data);
  return response.data;
};

export const uploadUserAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  // Gọi vào UserController (Lưu vào wwwroot/avatar)
  const response = await api.post("/api/user/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // UserController của bạn trả về { FileName, Url }
  // Ta chỉ cần trả về Url để hiển thị, hoặc FileName để lưu DB tùy logic bên dưới
  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post("/api/auth/resend-verification", { Email: email });
  return response.data;
};

// --- SUPER ADMIN LANDING MANAGEMENT ---
export const getAllLandingsForSuperAdmin = async () => {
  const response = await api.get("/api/superadmin/landings");
  return response.data;
};

export const getLandingDetailForSuperAdmin = async (id) => {
  const response = await api.get(`/api/superadmin/landings/${id}`);
  return response.data;
};

// [MỚI] Lấy trang để sửa (Cho SuperAdmin)
export const getLandingForEditForSuperAdmin = async (id) => {
  const response = await api.get(`/api/superadmin/landings/edit/${id}`);
  return response.data;
};

// [MỚI] Lưu trang (Cho SuperAdmin)
export const updateLandingForSuperAdmin = async (id, data) => {
  const response = await api.put(`/api/superadmin/landings/edit/${id}`, data);
  return response.data;
};

export const updateTenantInfo = async (data) => {
  // data: { TenantName, Subdomain }
  const response = await api.put("/api/tenant/info", data);
  return response.data;
};

export default api;