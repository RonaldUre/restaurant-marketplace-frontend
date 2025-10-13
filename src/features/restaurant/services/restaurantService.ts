import { api } from "@/lib/axios";
import { type PaginatedResponse } from "@/types/pagination";

// --- Interfaces de Tipos (DTOs) ---

/**
 * Representa la tarjeta de un restaurante en el listado de la plataforma.
 * Coincide con `PlatformRestaurantCardResponse.java`.
 */
export interface PlatformRestaurantCard {
  id: number;
  name: string;
  slug: string;
  status: "OPEN" | "CLOSED" | "SUSPENDED";
  city?: string;
  createdAt: string; // ISO Date string
}

/**
 * Representa la dirección anidada en otros DTOs.
 * Coincide con `AddressRequest.java` y `AddressResponse.java`.
 */
export interface RestaurantAddress {
  line1?: string;
  line2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

/**
 * Representa el detalle completo de un restaurante.
 * Coincide con `RestaurantPublicResponse.java`.
 */
export interface RestaurantDetail {
  id: number;
  name: string;
  slug: string;
  status: "OPEN" | "CLOSED" | "SUSPENDED";
  email?: string;
  phone?: string;
  address?: RestaurantAddress;
  openingHoursJson?: string;
}

/**
 * Payload para registrar un nuevo restaurante.
 * Coincide con `RegisterRestaurantRequest.java`.
 */
export interface RegisterRestaurantPayload {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: RestaurantAddress;
  openingHoursJson?: string;
  adminEmail: string;
  adminPassword?: string; // Es opcional en el front para no mandarlo si está vacío
}

/**
 * Payload para los filtros del listado de la plataforma.
 * Coincide con `ListRestaurantsPlatformRequest.java`.
 */
export interface ListRestaurantsParams {
  page?: number;
  size?: number;
  statuses?: string[];
  city?: string;
  q?: string;
  sortBy?: "createdAt" | "name" | "status";
  sortDir?: "asc" | "desc";
}

// --- Funciones del Servicio API (Plataforma) ---

/**
 * Lista todos los restaurantes para la plataforma (SUPER_ADMIN).
 * GET /platform/restaurants
 */
export const getPlatformRestaurants = (params: ListRestaurantsParams = {}) => {
  return api.get<PaginatedResponse<PlatformRestaurantCard>>(
    "/platform/restaurants",
    { params }
  );
};

/**
 * Obtiene el detalle de un restaurante por su ID.
 * GET /platform/restaurants/{id}
 */
export const getPlatformRestaurantById = (id: number) => {
  return api.get<RestaurantDetail>(`/platform/restaurants/${id}`);
};

/**
 * Registra un nuevo restaurante en la plataforma.
 * POST /platform/restaurants
 */
export const registerRestaurant = (payload: RegisterRestaurantPayload) => {
  return api.post<RestaurantDetail>("/platform/restaurants", payload);
};

/**
 * Suspende un restaurante por su ID.
 * POST /platform/restaurants/{id}/suspend
 */
export const suspendRestaurant = (id: number, reason?: string) => {
  return api.post<RestaurantDetail>(`/platform/restaurants/${id}/suspend`, null, {
    params: { reason },
  });
};

/**
 * Reactiva (unsuspend) un restaurante por su ID.
 * POST /platform/restaurants/{id}/unsuspend
 */
export const unsuspendRestaurant = (id: number) => {
  return api.post<RestaurantDetail>(`/platform/restaurants/${id}/unsuspend`);
};