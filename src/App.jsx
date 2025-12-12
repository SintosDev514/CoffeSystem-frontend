import React from "react";
import { Routes, Route } from "react-router-dom"; // <-- only import Routes & Route

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import UserHomePage from "./pages/UserHomePage";
import CreatePage from "./pages/CreatePage";
import CustomerNavbar from "./components/CustomerNavbar";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ChangePass from "./pages/ChangePass";

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Change Pass */}
      <Route path="/changepassword" element={<ChangePass />} />

      {/* User Home */}
      <Route path="/userhomepage" element={<UserHomePage />} />

      {/* Admin Home */}
      <Route path="/adminhomepage" element={<AdminHomePage />} />

      {/* Create (for Admins) */}
      <Route path="/create" element={<CreatePage />} />
      <Route path="/admin/create" element={<CreatePage />} />

      {/* Customer Navbar */}
      <Route path="/CustomerNavbar" element={<CustomerNavbar />} />

      {/* Forgot / Reset Password */}
      <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin Orders */}
      <Route path="/adminorders" element={<AdminOrdersPage />} />
    </Routes>
  );
}

export default App;
