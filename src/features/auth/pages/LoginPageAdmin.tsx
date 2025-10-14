// src/features/auth/pages/LoginPageAdmin.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginInput } from "../schemas/authSchema";
import { Link } from "react-router-dom";
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

export default function LoginPageAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      // 👇 CAMBIO: Obtenemos el usuario después del login
      const user = await login("admin", values.email, values.password);
      toast.success("Acceso de administrador concedido.");

      // 👇 CAMBIO: Redirigimos según el rol
      switch (user.role) {
        case "SUPER_ADMIN":
          navigate("/admin/dashboard");
          break;
        case "RESTAURANT_ADMIN":
          navigate("/admin/my-restaurant");
          break;
        default:
          navigate("/"); // Fallback a la landing page
      }
    } catch (error) {
      console.error("Error de login de admin:", error);
      toast.error("Credenciales de administrador incorrectas.");
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <Card className="w-full max-w-sm bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white">
            Acceso de Administrador
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Ingresa tus credenciales de administrador
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
          <Button variant="link" asChild>
            <Link to="/login/customer" className="text-slate-400">
              ¿No eres admin? Ingresa como cliente
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
