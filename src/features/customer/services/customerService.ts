// src/features/customer/services/customerService.ts
import { api } from "@/lib/axios";

// --- Interfaces de Tipos (DTOs) ---

/**
 * Representa los datos del perfil del cliente autenticado.
 * Coincide con `CustomerMeResponse.java` del backend.
 */
export interface CustomerProfile {
  id: number;
  email: string;
  name: string;
  phone?: string | null; // El teléfono puede ser nulo o no estar presente
  createdAt: string; // Se recibe como un string en formato ISO
  updatedAt: string; // Se recibe como un string en formato ISO
}

/**
 * Representa los datos necesarios para actualizar el perfil de un cliente.
 * Coincide con `UpdateCustomerProfileRequest.java`.
 */
export interface UpdateCustomerProfilePayload {
  name: string;
  phone?: string | null;
}

/**
 * Representa los datos necesarios para cambiar la contraseña.
 * Coincide con `ChangeCustomerPasswordRequest.java`.
 */
export interface ChangeCustomerPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// --- Funciones del Servicio API ---

/**
 * Obtiene los datos del perfil del cliente autenticado.
 * GET /customers/me
 */
export const getCustomerMe = () => {
  return api.get<CustomerProfile>("/customers/me");
};

/**
 * Actualiza los datos del perfil del cliente autenticado.
 * PUT /customers/me
 */
export const updateCustomerProfile = (payload: UpdateCustomerProfilePayload) => {
  return api.put<CustomerProfile>("/customers/me", payload);
};

/**
 * Cambia la contraseña del cliente autenticado.
 * POST /customers/me/password
 */
export const changeCustomerPassword = (payload: ChangeCustomerPasswordPayload) => {
  // El backend responde con: { "status": "success" }
  return api.post<{ status: string }>("/customers/me/password", payload);
};