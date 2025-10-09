// src/features/auth/schemas/authSchema.ts
import { z } from "zod";

// --- Schema para el Login ---
export const loginSchema = z.object({
  email: z.string().email("Por favor, introduce un correo válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

// --- Schema para el Registro ---
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(120, "El nombre no puede exceder los 120 caracteres."),
    email: z.string().email("Por favor, introduce un correo válido."),
    phone: z.string().optional(), // El teléfono es opcional
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z
      .string()
      .min(8, "La confirmación debe tener al menos 8 caracteres."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // Si la validación falla, este mensaje se asigna al campo `confirmPassword`
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

// --- Exportar tipos inferidos de los schemas ---
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;