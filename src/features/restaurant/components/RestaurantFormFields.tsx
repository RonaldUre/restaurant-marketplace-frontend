import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Control } from "react-hook-form";
import { type RegisterRestaurantInput } from "../schemas/restaurantSchema";
import { Separator } from "@/components/ui/separator";

interface Props {
  control: Control<RegisterRestaurantInput>;
}

export function RestaurantFormFields({ control }: Props) {
  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: DATOS DEL RESTAURANTE */}
      <div>
        <h3 className="text-lg font-medium">Datos del Restaurante</h3>
        <Separator className="my-2" />
        <div className="space-y-4 pt-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Restaurante</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Pizzería Bella Napoli" {...field} />
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
                  <Input placeholder="ej-pizzeria-bella-napoli" {...field} />
                </FormControl>
                <FormDescription>
                  Identificador único en la URL. Usar solo minúsculas y guiones.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* SECCIÓN 2: CONTACTO Y DIRECCIÓN */}
      <div>
        <h3 className="text-lg font-medium">Contacto y Dirección (Opcional)</h3>
        <Separator className="my-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de Contacto</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contacto@bellanapoli.com"
                    {...field}
                  />
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
                  <Input placeholder="+58 212-555-1234" {...field} />
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
                  <Input placeholder="Caracas" {...field} />
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
                <FormLabel>Código País</FormLabel>
                <FormControl>
                  <Input placeholder="VE" {...field} />
                </FormControl>
                <FormDescription>Código ISO de 2 letras.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* SECCIÓN 3: CREDENCIALES DEL ADMINISTRADOR */}
      <div>
        <h3 className="text-lg font-medium">Credenciales del Administrador</h3>
        <Separator className="my-2" />
        <div className="space-y-4 pt-2">
          <FormField
            control={control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email del Administrador</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@bellanapoli.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="adminPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmAdminPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
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
