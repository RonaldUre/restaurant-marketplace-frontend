// src/features/my-restaurant/components/ProductFormFields.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { CreateProductInput, UpdateProductInput } from "../schemas/productSchema";

type FormValues = CreateProductInput | UpdateProductInput;

interface Props {
  /** Control de react-hook-form; puede ser de Create o de Update */
  control: Control<FormValues>;
  /** Modo del formulario: en 'create' se muestra SKU; en 'edit' se oculta */
  mode?: "create" | "edit";
}

export function ProductFormFields({ control, mode = "create" }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SKU (solo en creación) */}
        {mode === "create" && (
          <FormField
            control={control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="ABC-001" maxLength={64} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Nombre */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Pizza Margarita" maxLength={255} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categoría */}
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Pizzas" maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Precio (amount) */}
        <FormField
          control={control}
          name="priceAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12.50"
                  inputMode="decimal"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Moneda */}
        <FormField
          control={control}
          name="priceCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda (ISO 4217)</FormLabel>
              <FormControl>
                <Input
                  placeholder="USD"
                  maxLength={3}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Descripción */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Breve descripción del producto..."
                className="min-h-[120px]"
                maxLength={4000}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default ProductFormFields;
