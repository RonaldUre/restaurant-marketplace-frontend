import { Input } from "@/components/ui/input";
import { type Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UpdateProfileInput } from "../schemas/profileSchema";

// 1. Se actualiza la interfaz para aceptar la prop 'email'
interface Props {
  control: Control<UpdateProfileInput>;
  email?: string; // Se añade la prop opcional para el correo
}

export function ProfileFormFields({ control, email }: Props) {
  return (
    <>
      {/* 2. Se añade un campo de solo lectura para mostrar el email */}
      <FormItem>
        <FormLabel>Correo electrónico (no editable)</FormLabel>
        <FormControl>
          <Input value={email ?? "Cargando..."} disabled />
        </FormControl>
      </FormItem>

      {/* --- Campos editables existentes --- */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre completo</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
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
              <Input
                placeholder="Escribe tu teléfono"
                {...field}
                value={field.value ?? ""} // Asegura que el valor nunca sea null
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

