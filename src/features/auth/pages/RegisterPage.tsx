import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schemas/authSchema";
import { registerCustomer } from "../services/authService";
// ✅ 1. IMPORTA 'Link' y 'CardFooter'
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter, // <- Añadido
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RegisterFormFields } from "../components/RegisterFormFields";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    try {
      await registerCustomer(values);
      toast.success("¡Cuenta creada exitosamente!");
      toast.info("Por favor, inicia sesión para continuar.");
      navigate("/login/customer");
    } catch (error) {
      console.error("Error en el registro:", error);

      if (error instanceof AxiosError && error.response) {
        const errorCode = error.response.data.code;
        if (errorCode === "CUSTOMER_ALREADY_EXISTS") {
          toast.error("Este correo electrónico ya está en uso.");
        } else {
          toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
        }
      } else {
        toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Crear una Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <RegisterFormFields control={form.control} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* ✅ 2. AÑADIMOS EL FOOTER CON EL ENLACE AL LOGIN */}
        <CardFooter className="text-sm justify-center">
            <span>¿Ya tienes una cuenta? </span>
            <Button variant="link" asChild>
                <Link to="/login/customer">Inicia sesión</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}