import { Routes, Route } from "react-router-dom";

// Layouts
import PrivateLayout from "@/components/layout/PrivateLayout";

// Páginas
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPageCustomer from "@/features/auth/pages/LoginPageCustomer";
import LoginPageAdmin from "@/features/auth/pages/LoginPageAdmin";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import DashboardAdminPage from "@/features/admin/pages/DashboardAdminPage";
import ProfilePage from "@/features/customer/pages/ProfilePage"; // 👈 1. IMPORTAR LA NUEVA PÁGINA

// Lógica de rutas
import { ProtectedRoute } from "./ProtectedRoute";
import { LandingPage } from "./LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login/customer" element={<LoginPageCustomer />} />
      <Route path="/admin/login" element={<LoginPageAdmin />} />

      {/* --- Rutas Protegidas (envueltas con el Layout) --- */}
      <Route element={<PrivateLayout />}>
        {/* Rutas para Clientes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* 👇 2. AÑADIR LA NUEVA RUTA DE PERFIL 👇 */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Rutas para Administradores */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN", "SUPER_ADMIN"]}>
              <DashboardAdminPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
