import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Control } from "react-hook-form";
import { type UpdateProfileInput } from "../schemas/myRestaurantSchema";
import { Separator } from "@/components/ui/separator";

interface Props {
  control: Control<UpdateProfileInput>;
}

export function ProfileFormFields({ control }: Props) {
  return (
    <div className="space-y-6">
      {/* Campos Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Restaurante</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Trattoria Da Vinci" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <Input placeholder="ej-trattoria-da-vinci" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de Contacto</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contacto@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="+58 412-1234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      {/* Campos de Dirección */}
      <div>
        <h3 className="text-lg font-medium mb-2">Dirección</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
            control={control}
            name="address.line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Línea 1</FormLabel>
                <FormControl>
                  <Input placeholder="Av. Principal, Edificio Central" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Roma" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código País (2 letras)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: IT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={control}
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 00100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
