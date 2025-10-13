// src/features/my-restaurant/services/myRestaurantService.ts
import { api } from "@/lib/axios";

// --- Interfaces de Tipos (DTOs) ---

/**
 * Representa la dirección de un restaurante.
 * Basado en AddressRequest.java y AddressResponse.java
 */
export interface RestaurantAddress {
  line1?: string;
  line2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

/**
 * Representa la respuesta detallada del perfil de un restaurante.
 * Basado en RestaurantPublicResponse.java
 */
export interface MyRestaurantResponse {
  id: number;
  name: string;
  slug: string;
  status: "OPEN" | "CLOSED" | "SUSPENDED";
  email: string;
  phone: string;
  address: RestaurantAddress;
  openingHoursJson: string;
}

/**
 * Payload para actualizar el perfil del restaurante.
 * Basado en UpdateRestaurantProfileRequest.java
 */
export interface UpdateMyRestaurantPayload {
  name?: string;
  slug?: string;
  email?: string;
  phone?: string;
  address?: RestaurantAddress;
}

/**
 * Payload para actualizar los horarios de apertura.
 * Basado en UpdateOpeningHoursRequest.java
 */
export interface UpdateOpeningHoursPayload {
  openingHoursJson: string;
}

// --- Funciones del Servicio API ---

/**
 * Obtiene los detalles del restaurante del administrador autenticado.
 * GET /admin/restaurants/me
 */
export const getMyRestaurant = () => {
  return api.get<MyRestaurantResponse>("/admin/restaurants/me");
};

/**
 * Actualiza el perfil del restaurante.
 * PUT /admin/restaurants/profile
 */
export const updateMyRestaurantProfile = (
  payload: UpdateMyRestaurantPayload
) => {
  return api.put<MyRestaurantResponse>("/admin/restaurants/profile", payload);
};

/**
 * Actualiza los horarios de apertura del restaurante.
 * PUT /admin/restaurants/opening-hours
 */
export const updateMyRestaurantOpeningHours = (
  payload: UpdateOpeningHoursPayload
) => {
  return api.put<MyRestaurantResponse>(
    "/admin/restaurants/opening-hours",
    payload
  );
};

/**
 * Cambia el estado del restaurante a "OPEN".
 * POST /admin/restaurants/open
 */
export const openMyRestaurant = () => {
  return api.post<MyRestaurantResponse>("/admin/restaurants/open");
};

/**
 * Cambia el estado del restaurante a "CLOSED".
 * POST /admin/restaurants/close
 */
export const closeMyRestaurant = () => {
  return api.post<MyRestaurantResponse>("/admin/restaurants/close");
};
