import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";

// Importaciones del módulo
import {
  registerRestaurantSchema,
  type RegisterRestaurantInput,
} from "../schemas/restaurantSchema";
import { registerRestaurant } from "../services/restaurantService";
import { RestaurantFormFields } from "../components/RestaurantFormFields";

// Componentes de UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

export default function RestaurantFormPage() {
  const navigate = useNavigate();
  const form = useForm<RegisterRestaurantInput>({
    resolver: zodResolver(registerRestaurantSchema),
    defaultValues: {
      name: "",
      slug: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        city: "",
        country: "",
        postalCode: "",
      },
      adminEmail: "",
      adminPassword: "",
      confirmAdminPassword: "",
    },
  });

  const onSubmit = async (values: RegisterRestaurantInput) => {
    try {
      await registerRestaurant(values);
      toast.success("Restaurante registrado exitosamente.");
      navigate("/admin/restaurants");
    } catch (error) {
      console.error("Error al registrar el restaurante:", error);

      // Manejo de errores específicos de la API
      if (error instanceof AxiosError && error.response) {
        const errorCode = error.response.data.code;
        if (errorCode === "RESTAURANT_SLUG_ALREADY_IN_USE") {
          // Asigna el error al campo 'slug' en el formulario
          form.setError("slug", {
            type: "manual",
            message: "Este slug ya está en uso. Por favor, elige otro.",
          });
          toast.error("El slug ya está en uso.");
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/restaurants")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Registrar Nuevo Restaurante
          </h1>
          <p className="text-muted-foreground">
            Crea un nuevo restaurante y su cuenta de administrador.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Restaurante</CardTitle>
          <CardDescription>
            Información general y de contacto del nuevo local.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <RestaurantFormFields control={form.control} />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting
                  ? "Registrando..."
                  : "Registrar Restaurante"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}