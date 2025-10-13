import { z } from "zod";

// --- Schema para la Actualización del Perfil ---
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre no puede exceder los 120 caracteres."),
  phone: z
    .string()
    .max(30, "El teléfono no puede exceder los 30 caracteres.")
    .optional()
    .nullable(), // Permite que el campo sea opcional o nulo
});

// --- Schema para el Cambio de Contraseña ---
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria."),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
    confirmNewPassword: z
      .string()
      .min(8, "La confirmación debe tener al menos 8 caracteres."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    // Si la validación falla, este mensaje se asigna al campo `confirmNewPassword`
    message: "Las nuevas contraseñas no coinciden.",
    path: ["confirmNewPassword"],
  });

// --- Exportar tipos inferidos de los schemas ---
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
