import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Componentes de UI y Layout
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

// Lógica y componentes del módulo Customer
import {
  getCustomerMe,
  updateCustomerProfile,
  changeCustomerPassword,
  type CustomerProfile,
} from "../services/customerService";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "../schemas/profileSchema";
import { ProfileFormFields } from "../components/ProfileFormFields";
import { ChangePasswordFormFields } from "../components/ChangePasswordFormFields";

export default function ProfilePage() {
  // --- ESTADOS ---
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FORMULARIOS ---
  // Formulario para actualizar el perfil
  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Formulario para cambiar la contraseña
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // --- EFECTOS ---
  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCustomerMe();
        setProfile(response.data);
        // Rellenar el formulario con los datos obtenidos
        profileForm.reset({
          name: response.data.name,
          phone: response.data.phone ?? "",
        });
      } catch (error) {
        toast.error("No se pudo cargar la información del perfil.");
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [profileForm]); // Se incluye profileForm para cumplir con las reglas de los hooks

  // --- MANEJADORES DE ENVÍO ---
  const onUpdateProfile = async (values: UpdateProfileInput) => {
    try {
      const updatedProfile = await updateCustomerProfile(values);
      setProfile(updatedProfile.data); // Actualiza el estado local con los nuevos datos
      toast.success("Perfil actualizado correctamente.");
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
      toast.error("Error al actualizar el perfil.");
    }
  };

  const onChangePassword = async (values: ChangePasswordInput) => {
    try {
      await changeCustomerPassword(values);
      toast.success("Contraseña cambiada exitosamente.");
      passwordForm.reset(); // Limpia los campos del formulario de contraseña
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
      toast.error(
        "No se pudo cambiar la contraseña. Verifica tu contraseña actual."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Cargando perfil...
      </div>
    );
  }

  // --- RENDERIZADO ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona la información de tu cuenta y tu contraseña.
        </p>
      </div>

      {/* --- FORMULARIO DE PERFIL --- */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu nombre y número de teléfono. Tu correo electrónico no
            se puede cambiar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onUpdateProfile)}
              className="space-y-4"
            >
              <ProfileFormFields
                control={profileForm.control}
                email={profile?.email} // Pasamos el email para mostrarlo deshabilitado
              />
              <Button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
              >
                {profileForm.formState.isSubmitting
                  ? "Guardando..."
                  : "Guardar Cambios"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* --- FORMULARIO DE CONTRASEÑA --- */}
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>
            Para tu seguridad, te recomendamos elegir una contraseña fuerte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onChangePassword)}
              className="space-y-4"
            >
              <ChangePasswordFormFields control={passwordForm.control} />
              <Button
                type="submit"
                variant="secondary"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting
                  ? "Actualizando..."
                  : "Actualizar Contraseña"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}