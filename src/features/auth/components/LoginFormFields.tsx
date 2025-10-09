// src/features/auth/components/LoginFormFields.tsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Control } from "react-hook-form";
import { type LoginInput } from "../schemas/authSchema";

interface Props {
  control: Control<LoginInput>;
}

export function LoginFormFields({ control }: Props) {
  return (
    <>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contraseña</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}