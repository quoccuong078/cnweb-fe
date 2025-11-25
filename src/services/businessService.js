import api from "./api";

const BASE_URL = "/api/superadmin/tenants";

export const getAllTenants = async () => {
    const response = await api.get(BASE_URL);
    return response.data;
};

export const getTenantUsers = async (tenantId) => {
    const response = await api.get(`${BASE_URL}/${tenantId}/users`);
    return response.data;
};

export const updateTenant = async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

// [MỚI] Hàm khóa/mở khóa
export const toggleTenantStatus = async (id, isLocked) => {
  // isLocked = true nghĩa là hành động này sẽ KHÓA doanh nghiệp
    const response = await api.patch(`${BASE_URL}/${id}/status`, { IsLocked: isLocked });
    return response.data;
};