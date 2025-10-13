import { z } from "zod";

// --- Esquema reutilizable para la Dirección ---
const addressSchema = z.object({
  line1: z.string().max(255).optional(),
  line2: z.string().max(255).optional(),
  city: z.string().max(120).optional(),
  country: z
    .string()
    .length(2, "Debe ser un código de país de 2 letras (ISO 3166-1 alpha-2)")
    .optional(),
  postalCode: z.string().max(20).optional(),
});

// --- Esquema principal para el registro de un Restaurante ---
export const registerRestaurantSchema = z
  .object({
    // Perfil básico
    name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(120, "El nombre no puede exceder los 120 caracteres"),
    slug: z
      .string()
      .min(1, "El slug es obligatorio")
      .max(140, "El slug no puede exceder los 140 caracteres")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "El slug solo puede contener letras minúsculas, números y guiones"
      ),

    // Contacto (opcional)
    email: z
      .string()
      .email("Por favor, introduce un correo válido")
      .max(255)
      .optional()
      .or(z.literal("")),
    phone: z.string().max(30).optional(),

    // Dirección (opcional)
    address: addressSchema.optional(),

    // Horarios (opcional)
    openingHoursJson: z.string().max(10000).optional(),

    // Credenciales del administrador del restaurante
    adminEmail: z
      .string()
      .min(1, "El correo del administrador es obligatorio")
      .email("Correo de administrador inválido"),
      
    // --- VALIDACIÓN DE CONTRASEÑA ACTUALIZADA ---
    adminPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        "La contraseña debe contener al menos una letra y un número"
      ),
    confirmAdminPassword: z
      .string()
      .min(8, "La confirmación debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.adminPassword === data.confirmAdminPassword, {
    message: "Las contraseñas del administrador no coinciden",
    path: ["confirmAdminPassword"],
  });

// --- Exportar el tipo inferido del schema ---
export type RegisterRestaurantInput = z.infer<typeof registerRestaurantSchema>;