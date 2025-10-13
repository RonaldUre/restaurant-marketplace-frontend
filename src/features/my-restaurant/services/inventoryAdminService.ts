// src/features/my-restaurant/services/inventoryAdminService.ts
import { api } from "@/lib/axios";
import { type PaginatedResponse } from "@/types/pagination";

// --- Interfaces de Tipos (DTOs) ---

/**
 * Representa un item en la lista de inventario del panel de administración.
 * Basado en InventoryAdminItemResponse.java
 */
export interface InventoryAdminItem {
  productId: number;
  sku: string;
  name: string;
  category: string;
  available: number | null; // null significa ilimitado
  reserved: number;
  unlimited: boolean;
  updatedAt: string;
}

/**
 * Parámetros para listar/filtrar el inventario.
 * Basado en ListInventoryAdminRequest.java
 */
export interface ListInventoryAdminParams {
  page?: number;
  size?: number;
  sku?: string;
  productId?: number;
  category?: string;
  sortBy?: "name" | "sku" | "category" | "available" | "reserved" | "updatedAt";
  sortDir?: "asc" | "desc";
}

/**
 * Payload para ajustar el stock de un producto.
 * Basado en AdjustStockRequest.java
 */
export interface AdjustStockPayload {
  delta: number; // positivo para añadir, negativo para quitar
  reason?: string;
}

/**
 * Payload para cambiar un producto a stock limitado.
 * Basado en SwitchToLimitedRequest.java
 */
export interface SwitchToLimitedPayload {
  initialAvailable: number;
}

// --- Funciones del Servicio API ---

/**
 * Obtiene una lista paginada del inventario.
 * GET /admin/inventory
 */
export const getInventoryAdmin = (params: ListInventoryAdminParams = {}) => {
  return api.get<PaginatedResponse<InventoryAdminItem>>("/admin/inventory", {
    params,
  });
};

/**
 * Ajusta la cantidad de stock disponible para un producto.
 * POST /admin/inventory/{productId}/adjust
 */
export const adjustStock = (
  productId: number,
  payload: AdjustStockPayload
) => {
  return api.post<InventoryAdminItem>(
    `/admin/inventory/${productId}/adjust`,
    payload
  );
};

/**
 * Cambia un producto de stock ilimitado a limitado, estableciendo una cantidad inicial.
 * POST /admin/inventory/{productId}/switch-to-limited
 */
export const switchToLimited = (
  productId: number,
  payload: SwitchToLimitedPayload
) => {
  return api.post<InventoryAdminItem>(
    `/admin/inventory/${productId}/switch-to-limited`,
    payload
  );
};

/**
 * Cambia un producto de stock limitado a ilimitado.
 * POST /admin/inventory/{productId}/switch-to-unlimited
 */
export const switchToUnlimited = (productId: number) => {
  return api.post<InventoryAdminItem>(
    `/admin/inventory/${productId}/switch-to-unlimited`
  );
};
