import { z } from "zod";

// --- Schema para el formulario de ajuste de stock (validando como strings) ---
export const adjustStockSchema = z.object({
  // Validamos que 'delta' sea un string que se pueda convertir a número y que no sea "0"
  delta: z
    .string()
    .min(1, "Este campo es requerido.")
    .refine((val) => !isNaN(Number(val)), "Debe ser un número válido.")
    .refine((val) => Number(val) !== 0, "El ajuste no puede ser cero."),
  reason: z
    .string()
    .max(500, "La razón no puede exceder los 500 caracteres")
    .optional(),
});

// --- Schema para el formulario de cambio a stock limitado (validando como strings) ---
export const switchToLimitedSchema = z.object({
  // Validamos que 'initialAvailable' sea un string que se pueda convertir a número y que no sea negativo
  initialAvailable: z
    .string()
    .min(1, "Este campo es requerido.")
    .refine((val) => !isNaN(Number(val)), "Debe ser un número válido.")
    .refine(
      (val) => Number(val) >= 0,
      "El stock inicial no puede ser negativo."
    ),
});

// Solo necesitamos un tipo por schema, que es el que usa el formulario (con strings)
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type SwitchToLimitedInput = z.infer<typeof switchToLimitedSchema>;