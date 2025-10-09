// src/features/auth/pages/LoginPageCustomer.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/authSchema";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoginFormFields } from "../components/LoginFormFields";
import { useAuth } from "../hooks/useAuth"; // 👈 1. Importa el hook useAuth

export default function LoginPageCustomer() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 2. Obtén la función de login del contexto

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // 3. Conecta el `onSubmit` a la función de login del contexto
  const onSubmit = async (values: LoginInput) => {
    try {
      // 👇 Llama a login con el tipo 'customer'
      await login("customer", values.email, values.password);
      toast.success("¡Bienvenido de nuevo!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error de login:", error);
      toast.error("Credenciales incorrectas. Por favor, intenta de nuevo.");
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Acceso de Cliente
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <LoginFormFields control={form.control} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm justify-center">
          <span>¿No tienes una cuenta?</span>
          <Button variant="link" asChild>
            <Link to="/register">Regístrate aquí</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
