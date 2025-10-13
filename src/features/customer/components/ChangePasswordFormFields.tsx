import { Input } from "@/components/ui/input";
import { type Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ChangePasswordInput } from "../schemas/profileSchema";

// 1. Aceptamos el email como prop
interface Props {
  control: Control<ChangePasswordInput>;
  email?: string;
}

export function ChangePasswordFormFields({ control, email }: Props) {
  return (
    <>
      {/* 2. Añadimos un campo de username oculto para el autocompletado */}
      <input type="text" name="username" autoComplete="username" value={email} readOnly className="hidden" />

      <FormField
        control={control}
        name="currentPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contraseña actual</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                {...field}
                autoComplete="current-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nueva contraseña</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                {...field}
                autoComplete="new-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmNewPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmar nueva contraseña</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                {...field}
                autoComplete="new-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}