import { z } from "zod";

// --- Esquema para la dirección (opcional) ---
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

// --- Esquema para actualizar el PERFIL del restaurante ---
// Basado en UpdateMyRestaurantPayload
export const updateProfileSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .max(140)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  email: z.string().email("Correo inválido").max(255).optional().or(z.literal("")),
  phone: z.string().max(30).optional(),
  address: addressSchema.optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;


// --- Esquema para actualizar los HORARIOS de apertura ---
// Basado en UpdateOpeningHoursPayload
export const updateOpeningHoursSchema = z.object({
  openingHoursJson: z
    .string()
    .min(2, "El JSON de horarios no puede estar vacío")
    .refine(
      (value) => {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "El texto introducido no es un JSON válido." }
    ),
});
export type UpdateOpeningHoursInput = z.infer<typeof updateOpeningHoursSchema>;