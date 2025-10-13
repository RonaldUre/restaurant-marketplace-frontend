import { z } from "zod";

// --- Parsear número desde un input de texto, con validaciones encadenadas ---
const priceFromInput = z
  .string()
  .min(1, "El precio es requerido.") // reemplaza required_error
  .transform((val, ctx) => {
    const parsed = Number(val);
    if (Number.isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El precio debe ser un número válido.",
      });
      return z.NEVER;
    }
    return parsed;
  })
  // después del transform, usa .pipe() para aplicar validaciones de número
  .pipe(z.number().min(0, "El precio no puede ser negativo."));

// --- Schema Base (campos comunes para crear y editar) ---
const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es requerido.")
    .max(255, "El nombre no puede exceder los 255 caracteres."),
  description: z.string().max(4000).optional(),
  category: z
    .string()
    .trim()
    .min(1, "La categoría es requerida.")
    .max(100, "La categoría no puede exceder los 100 caracteres."),
  // ya no llames .min() aquí; va dentro de priceFromInput
  priceAmount: priceFromInput,
  priceCurrency: z
    .string()
    .trim()
    .min(1, "La moneda es requerida.")
    .length(3, "La moneda debe ser un código de 3 letras (ISO 4217).")
    .transform((v) => v.toUpperCase()),
});

// --- Schema para Crear un Producto (incluye SKU) ---
export const createProductSchema = productBaseSchema.extend({
  sku: z
    .string()
    .trim()
    .min(1, "El SKU es requerido.")
    .max(64, "El SKU no puede exceder los 64 caracteres.")
    .regex(
      /^[A-Za-z0-9._-]{1,64}$/,
      "El SKU solo puede contener letras, números, puntos, guiones y guiones bajos."
    ),
});

// --- Schema para Actualizar un Producto (excluye SKU) ---
export const updateProductSchema = productBaseSchema;

// --- Tipos para el Formulario ---
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
