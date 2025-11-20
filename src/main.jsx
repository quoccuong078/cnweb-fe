// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import AuthPage from "./Auth/AuthPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import SuperAdminLayout from "./layouts/SuperAdminLayout.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement.jsx";
import Homepage from "./pages/Homepages/Homepage.jsx";
import CreateLanding from "./pages/LandingManagement/CreateLanding.jsx";
import EditorPage from "./pages/LandingManagement/EditorPage.jsx";
import LandingManagement from "./pages/LandingManagement/LandingManagement.jsx";
import ProductList from "./pages/ProductManagement/ProductList.jsx";
import ProfilePage from "./pages/ProfilePageManagement/ProfilePage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import RolesList from "./pages/superadmin/RolesList.jsx";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard.jsx";
import UserManagement from "./pages/UserManagement/UserManagement.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import StatisticsPage from "./pages/admin/StatisticsPage";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/homepages" element={<Homepage />} />
          </Route>

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            {/* Admin routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/landing-management" element={<LandingManagement />} />
              <Route path="/admin/create-landing" element={<CreateLanding />} />
              <Route path="/admin/editor" element={<EditorPage />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/employees" element={<EmployeeManagement />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
              <Route path="/admin/statistics" element={<StatisticsPage />} />
            </Route>

            {/* SuperAdmin routes */}
            <Route element={<SuperAdminLayout />}>
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/users" element={<UserManagement />} />
              <Route path="/superadmin/profile" element={<ProfilePage />} />
              <Route path="/superadmin/roles" element={<RolesList />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);