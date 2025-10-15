// src/router/index.tsx
import { Routes, Route } from "react-router-dom";

// --- Layouts & Route Guards ---
import PrivateLayout from "@/components/layout/PrivateLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// --- Public Pages ---
import { LandingPage } from "./LandingPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPageCustomer from "@/features/auth/pages/LoginPageCustomer";
import LoginPageAdmin from "@/features/auth/pages/LoginPageAdmin";

// --- Customer Pages ---
import ProfilePage from "@/features/customer/pages/ProfilePage";
import MarketplacePage from "@/features/marketplace/pages/MarketplacePage";
import RestaurantDetailPage from "@/features/marketplace/pages/RestaurantDetailPage";

// --- Super Admin Pages ---
import PlatformReportsPage from "@/features/reporting/pages/PlatformReportsPage"; // 👈 1. Importa la nueva página
import RestaurantListPage from "@/features/restaurant/pages/RestaurantListPage";
import RestaurantFormPage from "@/features/restaurant/pages/RestaurantFormPage";
import MyOrdersPage from "@/features/marketplace/pages/MyOrdersPage";
import PaymentSuccessPage from "@/features/marketplace/pages/PaymentSuccessPage";
import PaymentCancelledPage from "@/features/marketplace/pages/PaymentCancelledPage";

// --- Restaurant Admin Pages ---
import MyRestaurantPage from "@/features/my-restaurant/pages/MyRestaurantPage";
import ProductFormPage from "@/features/my-restaurant/pages/ProductFormPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login/customer" element={<LoginPageCustomer />} />
      <Route path="/admin/login" element={<LoginPageAdmin />} />

      {/* --- Rutas Protegidas --- */}
      <Route element={<PrivateLayout />}>
        {/* === Customer Routes === */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:slug"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <RestaurantDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/cancelled"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <PaymentCancelledPage />
            </ProtectedRoute>
          }
        />
        {/* === SUPER_ADMIN Routes === */}
        <Route
          path="/admin/dashboard" // 👈
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <PlatformReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <RestaurantListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/restaurants/new"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <RestaurantFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/restaurants/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <RestaurantFormPage />
            </ProtectedRoute>
          }
        />

        {/* === RESTAURANT_ADMIN Routes === */}
        <Route
          path="/admin/my-restaurant"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN"]}>
              <MyRestaurantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/my-restaurant/products/new"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN"]}>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/my-restaurant/products/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN"]}>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
