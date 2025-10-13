// src/features/auth/services/authService.ts
import { api, publicApi  } from "@/lib/axios";

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

export interface LogoutPayload { // 👈 AÑADE ESTA INTERFAZ
  refreshToken: string;
}

// --- Funciones del Servicio API ---

/**
 * Llama al endpoint de login para clientes.
 * POST /auth/login/customer
 */
export const loginCustomer = (payload: LoginPayload) => {
  // 👇 2. Usa publicApi
  return publicApi.post<TokenResponse>("/auth/login/customer", payload);
};

/**
 * Llama al endpoint de login para administradores.
 * POST /auth/login/admin
 */
export const loginAdmin = (payload: LoginPayload) => {
  // 👇 3. Usa publicApi
  return publicApi.post<TokenResponse>("/auth/login/admin", payload);
};

/**
 * Llama al endpoint de registro público para clientes.
 * POST /public/customers
 */
export const registerCustomer = (payload: RegisterPayload) => {
  // 👇 4. Usa publicApi
  return publicApi.post<CustomerRegisteredResponse>("/public/customers", payload);
};

export const logoutUser = (payload: LogoutPayload, allSessions = false) => {
  // 👇 Construimos la URL dinámicamente
  const url = allSessions ? "/auth/logout?all=true" : "/auth/logout";
  
  // Usamos la URL construida en la llamada a la API
  return api.post(url, payload);
};

/**
 * Llama al endpoint de refresco de token.
 * POST /auth/refresh
 */
export const refreshToken = (payload: RefreshPayload) => {
  // 👇 5. ¡LA MÁS IMPORTANTE! Usa publicApi
  return publicApi.post<TokenResponse>("/auth/refresh", payload);
};

/**
 * Obtiene los datos del cliente autenticado.
 * GET /customers/me
 */
export const getCustomerMe = () => {
  // 👇 6. Esta se queda con 'api' porque es una ruta protegida
  return api.get("/customers/me");
};