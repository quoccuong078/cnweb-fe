import axios from "axios";

const API_URL = "https://localhost:7007/api/employees"; // Đổi port nếu cần

const getConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getEmployees = async () => {
  const res = await axios.get(API_URL, getConfig());
  return res.data;
};

export const createEmployee = async (data) => {
  const res = await axios.post(API_URL, data, getConfig());
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, getConfig());
  return res.data;
};

export const toggleEmployeeStatus = async (id, isActive) => {
  const res = await axios.patch(`${API_URL}/${id}/status`, { id, isActive }, getConfig());
  return res.data;
};