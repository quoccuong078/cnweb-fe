/* eslint-disable react/jsx-no-undef */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./components/Homepages/Homepage.jsx";
import AuthPage from "./Auth/AuthPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ResetPassword from "./Auth/ResetPassword/ResetPassword.jsx";
import UserManagement from "./components/UserManagement/UserManagement.jsx";
import ProductList from "./components/ProductManagement/ProductList.jsx";
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
          <Route path="/users" element={<UserManagement />} />
          <Route path="/products" element={<ProductList />} />
        </Route>

        {/* Trang đăng nhập riêng, không có Navbar + Footer */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
