/* eslint-disable react/jsx-no-undef */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./components/Homepages/Homepage.jsx";
import AuthPage from "./Auth/AuthPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import RolesList from "./pages/admin/RolesList.jsx";
import CreateLanding from "./pages/admin/CreateLanding.jsx";
import EditorPage from "./pages/admin/EditorPage.jsx";

import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Layout chính có Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/homepages" element={<Homepage />} />
        </Route>

        {/* Trang đăng nhập riêng, không có Navbar + Footer */}
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="roles" element={<RolesList />} />
          <Route path="create-landing" element={<CreateLanding />} />
          <Route path="editor" element={<EditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);