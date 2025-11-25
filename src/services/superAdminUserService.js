import api from "./api";

const BASE_URL = "/api/superadmin/users";

export const getAllUsers = async () => {
    const response = await api.get(BASE_URL);
    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
};

export const toggleUserStatus = async (id, isLocked) => {
    // Backend đang map IsLocked = true -> Khóa (IsActive = false)
    const response = await api.patch(`${BASE_URL}/${id}/status`, { Id: id, IsLocked: isLocked });
    return response.data;
};

// Lấy danh sách tenant để đổ vào dropdown
export const getTenantsForSelect = async () => {
    const response = await api.get("/api/superadmin/tenants"); // Dùng lại API cũ
    return response.data;
};