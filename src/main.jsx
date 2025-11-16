import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import AuthPage from "./Auth/AuthPage.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import RolesList from "./pages/admin/RolesList.jsx";
import Homepage from "./pages/Homepages/Homepage.jsx";
import CreateLanding from "./pages/LandingManagement/CreateLanding.jsx";
import EditorPage from "./pages/LandingManagement/EditorPage.jsx";
import LandingManagement from "./pages/LandingManagement/LandingManagement.jsx";
import ProductList from "./pages/ProductManagement/ProductList.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import UserManagement from "./pages/UserManagement/UserManagement.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/homepages" element={<Homepage />} />
          </Route>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="landing-management" element={<LandingManagement />} />
            <Route path="roles" element={<RolesList />} />
            <Route path="create-landing" element={<CreateLanding />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductList />} />
          </Route>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);