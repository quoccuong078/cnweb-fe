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

// Pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import StatisticsPage from "./pages/admin/StatisticsPage";
import BusinessManagement from "./pages/BusinessManagement/BusinessManagement.jsx";
import ChangePassword from "./pages/ChangePasswordPage/ChangePasswordPage.jsx";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement.jsx";
import Homepage from "./pages/Homepages/Homepage.jsx";
import CreateLanding from "./pages/LandingManagement/CreateLanding.jsx";
import EditorPage from "./pages/LandingManagement/EditorPage.jsx";
import LandingManagement from "./pages/LandingManagement/LandingManagement.jsx";
import LandingDetailEdit from "./pages/Landings/LandingDetailEdit.jsx";
import LandingDetailView from "./pages/Landings/LandingDetailView.jsx";
import Landings from "./pages/Landings/Landings.jsx";
import LandingViewerPage from "./pages/LandingViewer/LandingViewerPage.jsx";
import ProfilePage from "./pages/ProfilePageManagement/ProfilePage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Statistics from "./pages/Statistics/Statistics.jsx";
import SubscriptionPage from "./pages/Subscription/SubscriptionPage.jsx";
import PlanManagement from "./pages/superadmin/PlanManagement.jsx";
import SubscriptionManagement from "./pages/superadmin/SubscriptionManagement.jsx";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard.jsx";
import UserManagement from "./pages/UserManagement/UserManagement.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

// Guest Pages (Mới)
import ContactPage from "./pages/Guest/ContactPage.jsx";
import FeaturesPage from "./pages/Guest/FeaturesPage.jsx";
import PricingPage from "./pages/Guest/PricingPage.jsx";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Guest Routes (MainLayout chứa Navbar & Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Landing Page Viewer (No Layout or Special Layout) */}
          <Route path="/:subdomain/:slug" element={<LandingViewerPage />} />
          <Route path="/:subdomain" element={<LandingViewerPage />} />

          {/* Auth */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/subscription" element={<SubscriptionPage />} />
              <Route path="/admin/landing-management" element={<LandingManagement />} />
              <Route path="/admin/create-landing" element={<CreateLanding />} />
              <Route path="/admin/editor" element={<EditorPage />} />
              <Route path="/admin/employees" element={<EmployeeManagement />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
              <Route path="/admin/statistics" element={<StatisticsPage />} />
              <Route path="/admin/change-password" element={<ChangePassword />} />
            </Route>

            <Route element={<SuperAdminLayout />}>
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/users" element={<UserManagement />} />
              <Route path="/superadmin/business" element={<BusinessManagement />} />
              <Route path="/superadmin/profile" element={<ProfilePage />} />
              <Route path="/superadmin/change-password" element={<ChangePassword />} />
              <Route path="/superadmin/plans" element={<PlanManagement />} /> {/* Route Mới */}
              <Route path="/superadmin/subscriptions" element={<SubscriptionManagement />} /> {/* Route Mới */}
              <Route path="/superadmin/landings" element={<Landings />} />
              <Route path="/superadmin/statistics" element={<Statistics />} />
              <Route path="/superadmin/landings/:id" element={<LandingDetailView />} />
              <Route path="/superadmin/landings/:id/edit" element={<LandingDetailEdit />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);