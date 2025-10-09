// src/lib/jwt.ts

/**
 * Decodifica un token JWT sin verificar la firma.
 * ¡OJO! Esto es solo para leer los datos del token en el frontend.
 * La validación real del token siempre debe ocurrir en el backend.
 */
export function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}