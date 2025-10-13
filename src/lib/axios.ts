/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/axios.ts
import axios from "axios";
import { refreshToken } from "@/features/auth/services/authService";
import { apiController } from "./apiSignal";

const baseURL = import.meta.env.VITE_API_URL;

// ✅ Instancia #1: Para llamadas públicas. SIN INTERCEPTORES.
export const publicApi = axios.create({
  baseURL,
});

// ✅ Instancia #2: Para llamadas privadas. CON INTERCEPTORES.
export const api = axios.create({
  baseURL,
});

// Lista de rutas que NUNCA deben llevar el token de autorización
const publicAuthUrls = [
  "/auth/login/customer",
  "/auth/login/admin",
  "/auth/refresh",
  "/public/customers",
];

// 1. Interceptor para AÑADIR el token a cada petición
api.interceptors.request.use(
  (config) => {
    // 👇 --- CAMBIO CLAVE AQUÍ --- 👇
    // No adjuntes el token de acceso a la petición de refresco
    // Esto vincula la petición al controller. Si el controller se aborta,
    // esta petición se cancelará.
    config.signal = apiController.signal;

    if (config.url && publicAuthUrls.includes(config.url)) {
      return config;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ... el resto del archivo permanece igual ...
// 2. Interceptor para MANEJAR la expiración del token
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (originalRequest.url?.endsWith("/auth/logout")) {
        console.warn(
          "Logout failed (likely expired token), not refreshing. Cleaning up client-side."
        );
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // --- LOG PARA DEPURAR ---
        console.log("REQUEST EN COLA:", originalRequest.url);
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // --- LOG PARA DEPURAR ---
      console.log("⛔ Token expirado. INICIANDO LÓGICA DE REFRESH.");

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");
        if (!currentRefreshToken) {
          console.error("No hay refresh token para intentar el refresco.");
          return Promise.reject(error);
        }

        const response = await refreshToken({
          refreshToken: currentRefreshToken,
        });

        // --- LOG PARA DEPURAR ---
        console.log(
          "✅ Token refrescado exitosamente. NUEVOS TOKENS RECIBIDOS."
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken); // Esto es correcto
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        // --- LOG PARA DEPURAR ---
        console.error(
          "❌ FALLÓ EL REFRESH TOKEN. Limpiando sesión.",
          refreshError
        );
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login/customer";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        // --- LOG PARA DEPURAR ---
        console.log("Lógica de refresh FINALIZADA.");
      }
    }
    return Promise.reject(error);
  }
);
