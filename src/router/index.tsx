// src/router/index.tsx
import { Routes, Route } from "react-router-dom";

// Layout
import PrivateLayout from "@/components/layout/PrivateLayout";

// Auth & Public Pages
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPageCustomer from "@/features/auth/pages/LoginPageCustomer";
import LoginPageAdmin from "@/features/auth/pages/LoginPageAdmin";
import { LandingPage } from "./LandingPage";
import { ProtectedRoute } from "./ProtectedRoute";

// Customer Pages
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProfilePage from "@/features/customer/pages/ProfilePage";

// Admin Pages
import DashboardAdminPage from "@/features/admin/pages/DashboardAdminPage";

// Platform (Super Admin) Pages
import RestaurantListPage from "@/features/restaurant/pages/RestaurantListPage";
// 👇 --- 1. IMPORTA LA PÁGINA DEL FORMULARIO ---
import RestaurantFormPage from "@/features/restaurant/pages/RestaurantFormPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login/customer" element={<LoginPageCustomer />} />
      <Route path="/admin/login" element={<LoginPageAdmin />} />

      {/* --- Rutas Privadas (con Sidebar y Layout) --- */}
      <Route element={<PrivateLayout />}>
        {/* --- Rutas de Cliente --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* --- Rutas de Administrador --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN", "SUPER_ADMIN"]}>
              <DashboardAdminPage />
            </ProtectedRoute>
          }
        />

        {/* --- Rutas de Super Admin --- */}
        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <RestaurantListPage />
            </ProtectedRoute>
          }
        />
        {/* 👇 --- 2. AÑADE LA RUTA PARA CREAR --- */}
        <Route
          path="/admin/restaurants/new"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <RestaurantFormPage />
            </ProtectedRoute>
          }
        />
        {/* NOTA: Aquí iría la ruta para editar: /admin/restaurants/:id/edit */}
      </Route>
    </Routes>
  );
}

