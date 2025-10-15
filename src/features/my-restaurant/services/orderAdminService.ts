import { api } from "@/lib/axios";
import type { PaginatedResponse } from "@/types/pagination";
// Reutilizamos los tipos de respuesta que ya existen para no duplicar código
import type { OrderCardResponse, OrderDetailResponse, CancelOrderPayload } from "@/features/marketplace/services/orderingService";

// --- Interfaces de Tipos (DTOs) ---

/**
 * Parámetros para listar/filtrar órdenes en el panel de admin.
 * Basado en ListOrdersAdminRequest.java
 */
export interface ListOrdersAdminParams {
  page?: number;
  size?: number;
  status?: "PENDING" | "PAID" | "CANCELLED";
  customerId?: number;
  createdFrom?: string; // ISO Date string
  createdTo?: string; // ISO Date string
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

// --- Funciones del Servicio API ---

/**
 * Obtiene una lista paginada de órdenes para el panel de administración.
 * GET /admin/orders
 */
export const listAdminOrders = (params: ListOrdersAdminParams = {}) => {
  return api.get<PaginatedResponse<OrderCardResponse>>("/admin/orders", { params });
};

/**
 * Obtiene los detalles de una orden específica (vista de admin).
 * GET /admin/orders/{id}
 */
export const getAdminOrderDetail = (orderId: number) => {
  return api.get<OrderDetailResponse>(`/admin/orders/${orderId}`);
};

/**
 * Cancela una orden (acción de admin).
 * POST /admin/orders/{id}/cancel
 */
export const cancelAdminOrder = (orderId: number, payload?: CancelOrderPayload) => {
  return api.post<OrderDetailResponse>(`/admin/orders/${orderId}/cancel`, payload);
};

/**
 * Confirma manualmente el pago de una orden (acción de admin).
 * POST /admin/orders/{id}/confirm-payment
 */
export const confirmAdminPayment = (orderId: number) => {
  return api.post<OrderDetailResponse>(`/admin/orders/${orderId}/confirm-payment`);
};