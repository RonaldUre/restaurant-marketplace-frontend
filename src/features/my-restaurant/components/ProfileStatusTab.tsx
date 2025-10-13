import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  getMyRestaurant,
  openMyRestaurant,
  closeMyRestaurant,
  updateMyRestaurantProfile,
  updateMyRestaurantOpeningHours,
  type MyRestaurantResponse,
} from "../services/myRestaurantService";
import {
  updateProfileSchema,
  updateOpeningHoursSchema,
  type UpdateProfileInput,
  type UpdateOpeningHoursInput,
} from "../schemas/myRestaurantSchema";
import { ProfileFormFields } from "./ProfileFormFields";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function ProfileStatusTab() {
  const [restaurant, setRestaurant] = useState<MyRestaurantResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- Formulario para el Perfil ---
  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
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
    },
  });

  // --- Formulario para los Horarios ---
  const hoursForm = useForm<UpdateOpeningHoursInput>({
    resolver: zodResolver(updateOpeningHoursSchema),
    defaultValues: {
      openingHoursJson: "{}",
    },
  });

  // --- Carga de datos inicial ---
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        const res = await getMyRestaurant();
        setRestaurant(res.data);
        // Rellenar formularios con los datos obtenidos
        profileForm.reset({
          name: res.data.name,
          slug: res.data.slug,
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: {
            line1: res.data.address?.line1 || "",
            city: res.data.address?.city || "",
            country: res.data.address?.country || "",
            postalCode: res.data.address?.postalCode || "",
          },
        });
        hoursForm.reset({
          openingHoursJson: res.data.openingHoursJson || "{}",
        });
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar la información de tu restaurante.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, [profileForm, hoursForm]);

  // --- Manejadores de Acciones ---
  const handleToggleStatus = async () => {
    if (!restaurant) return;
    const action = restaurant.status === "OPEN" ? closeMyRestaurant : openMyRestaurant;
    const successMessage = restaurant.status === "OPEN" 
      ? "Restaurante cerrado exitosamente." 
      : "Restaurante abierto exitosamente.";

    try {
      setIsActionLoading(true);
      const res = await action();
      setRestaurant(res.data); // Actualizar estado local
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cambiar el estado del restaurante.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const onProfileSubmit = async (values: UpdateProfileInput) => {
    try {
      const res = await updateMyRestaurantProfile(values);
      setRestaurant(res.data);
      toast.success("Perfil del restaurante actualizado.");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el perfil.");
    }
  };

  const onHoursSubmit = async (values: UpdateOpeningHoursInput) => {
     try {
      const res = await updateMyRestaurantOpeningHours(values);
      setRestaurant(res.data);
      toast.success("Horarios de apertura actualizados.");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar los horarios.");
    }
  };

  // --- Renderizado ---
  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!restaurant) {
    return <p>No se encontró información del restaurante.</p>;
  }

  return (
    <div className="grid gap-6">
      {/* Sección de Estado */}
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <CardTitle>Estado Actual del Restaurante</CardTitle>
                    <CardDescription>
                        Gestiona si tu restaurante está visible y operativo para los clientes.
                    </CardDescription>
                </div>
                 <Button onClick={handleToggleStatus} disabled={isActionLoading || restaurant.status === 'SUSPENDED'} variant={restaurant.status === "OPEN" ? "destructive" : "default"}>
                    {isActionLoading ? "Cambiando..." : (restaurant.status === "OPEN" ? "Cerrar Restaurante" : "Abrir Restaurante")}
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm">Tu restaurante está actualmente: 
                <Badge variant={restaurant.status === "OPEN" ? "success" : (restaurant.status === 'SUSPENDED' ? 'destructive' : 'secondary')} className="ml-2">
                    {restaurant.status}
                </Badge>
            </p>
            {restaurant.status === 'SUSPENDED' && <p className="text-destructive text-xs mt-2">Tu restaurante está suspendido. Contacta al administrador de la plataforma.</p>}
        </CardContent>
      </Card>
    
      {/* Sección de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
          <CardDescription>
            Edita los detalles públicos de tu restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <ProfileFormFields control={profileForm.control} />
              <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting ? "Guardando..." : "Guardar Cambios de Perfil"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Sección de Horarios */}
      <Card>
        <CardHeader>
          <CardTitle>Horarios de Apertura</CardTitle>
          <CardDescription>
            Especifica tus horarios en formato JSON.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...hoursForm}>
            <form onSubmit={hoursForm.handleSubmit(onHoursSubmit)} className="space-y-4">
              <FormField
                control={hoursForm.control}
                name="openingHoursJson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JSON de Horarios</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{ "Lunes": "9:00-18:00", ... }'
                        className="min-h-[150px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={hoursForm.formState.isSubmitting}>
                {hoursForm.formState.isSubmitting ? "Guardando..." : "Guardar Horarios"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

