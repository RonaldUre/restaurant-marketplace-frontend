// src/router/index.tsx
import { Routes, Route } from "react-router-dom";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPageCustomer from "@/features/auth/pages/LoginPageCustomer";
import LoginPageAdmin from "@/features/auth/pages/LoginPageAdmin";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { LandingPage } from "./LandingPage";
import DashboardAdminPage from "@/features/admin/pages/DashboardAdminPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login/customer" element={<LoginPageCustomer />} />
      <Route path="/admin/login" element={<LoginPageAdmin />} />

      {/* --- Rutas Protegidas para Clientes --- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* --- Rutas Protegidas para Administradores --- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN", "SUPER_ADMIN"]}>
            <DashboardAdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}