// src/features/my-restaurant/services/productAdminService.ts
import { api } from "@/lib/axios";
import { type PaginatedResponse } from "@/types/pagination";

// --- Interfaces de Tipos (DTOs) ---

/**
 * Representa la vista de tarjeta de un producto en el panel de administración.
 * Basado en ProductAdminCardResponse.java
 */
export interface ProductAdminCard {
  id: number;
  sku: string;
  name: string;
  category: string;
  priceAmount: number;
  priceCurrency: string;
  published: boolean;
  createdAt: string;
}

/**
 * Representa la vista detallada de un producto en el panel de administración.
 * Basado en ProductAdminDetailResponse.java
 */
export interface ProductAdminDetail extends ProductAdminCard {
  description: string;
  updatedAt: string;
}

/**
 * Payload para crear un nuevo producto.
 * Basado en CreateProductRequest.java
 */
export interface CreateProductPayload {
  sku: string;
  name: string;
  description?: string;
  category: string;
  priceAmount: number;
  priceCurrency: string;
}

/**
 * Payload para actualizar un producto existente.
 * Basado en UpdateProductRequest.java
 */
export type UpdateProductPayload = Omit<CreateProductPayload, "sku">;

/**
 * Parámetros para listar/filtrar productos en el panel de administración.
 * Basado en ListProductsAdminRequest.java
 */
export interface ListProductsAdminParams {
  page?: number;
  size?: number;
  q?: string;
  categories?: string[];
  published?: boolean;
  sortBy?: "createdAt" | "name" | "sku" | "category" | "priceAmount" | "published";
  sortDir?: "asc" | "desc";
}

// --- Funciones del Servicio API ---

/**
 * Obtiene una lista paginada de productos para el panel de administración.
 * GET /admin/products
 */
export const listProductsAdmin = (params: ListProductsAdminParams = {}) => {
  return api.get<PaginatedResponse<ProductAdminCard>>("/admin/products", {
    params,
  });
};

/**
 * Obtiene los detalles de un producto específico.
 * GET /admin/products/{id}
 */
export const getAdminProduct = (id: number) => {
  return api.get<ProductAdminDetail>(`/admin/products/${id}`);
};

/**
 * Crea un nuevo producto.
 * POST /admin/products
 */
export const createAdminProduct = (payload: CreateProductPayload) => {
  return api.post<ProductAdminDetail>("/admin/products", payload);
};

/**
 * Actualiza un producto existente.
 * PUT /admin/products/{id}
 */
export const updateAdminProduct = (id: number, payload: UpdateProductPayload) => {
  return api.put<ProductAdminDetail>(`/admin/products/${id}`, payload);
};

/**
 * Publica un producto para que sea visible a los clientes.
 * POST /admin/products/{id}/publish
 */
export const publishProduct = (id: number) => {
  return api.post<ProductAdminDetail>(`/admin/products/${id}/publish`);
};

/**
 * Oculta un producto de la vista de clientes.
 * POST /admin/products/{id}/unpublish
 */
export const unpublishProduct = (id: number) => {
  return api.post<ProductAdminDetail>(`/admin/products/${id}/unpublish`);
};
