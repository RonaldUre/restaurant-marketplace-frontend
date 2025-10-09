// src/features/auth/services/authService.ts
import { api } from "@/lib/axios";

// --- Interfaces de Tipos (DTOs) ---
// Basado en LoginRequest.java
export interface LoginPayload {
  email: string;
  password: string;
}

// Basado en RegisterCustomerRequest.java
export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// Basado en TokenResponse.java
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiresInSeconds: number;
}

// Basado en CustomerRegisteredResponse.java
export interface CustomerRegisteredResponse {
  id: number;
  email: string;
  name: string;
}

export interface RefreshPayload { // 👈 AÑADE ESTA INTERFAZ
  refreshToken: string;
}

// --- Funciones del Servicio API ---

/**
 * Llama al endpoint de login para clientes.
 * POST /auth/login/customer
 */
export const loginCustomer = (payload: LoginPayload) => {
  return api.post<TokenResponse>("/auth/login/customer", payload);
};

/**
 * Llama al endpoint de login para administradores.
 * POST /auth/login/admin
 */
export const loginAdmin = (payload: LoginPayload) => { // 👈 AÑADE ESTA NUEVA FUNCIÓN
  return api.post<TokenResponse>("/auth/login/admin", payload);
};

/**
 * Llama al endpoint de registro público para clientes.
 * POST /public/customers
 */
export const registerCustomer = (payload: RegisterPayload) => {
  return api.post<CustomerRegisteredResponse>("/public/customers", payload);
};

/**
 * Obtiene los datos del cliente autenticado.
 * GET /customers/me
 */
export const getCustomerMe = () => {
  return api.get("/customers/me");
};

export const refreshToken = (payload: RefreshPayload) => { // 👈 AÑADE ESTA FUNCIÓN
  return api.post<TokenResponse>("/auth/refresh", payload);
};