// src/services/dashboardService.js
import api from "./api";

const DASHBOARD_API = "/api/dashboard";

export const getAdminStats = () => api.get(`${DASHBOARD_API}/admin-stats`);
export const getAdminChartData = () => api.get(`${DASHBOARD_API}/admin-chart-data`);
// src/services/dashboardService.js
export const getSuperAdminStats = () => api.get("/api/dashboard/superadmin-stats");
export const getSuperAdminChartData = () => api.get("/api/dashboard/superadmin-chart-data");
export const getSuperAdminTopTenants = () => api.get(`${DASHBOARD_API}/superadmin-top-tenants`);