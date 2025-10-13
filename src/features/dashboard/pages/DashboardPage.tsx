// src/features/dashboard/pages/DashboardPage.tsx
import { useState } from "react"; // 👈 1. Importa useState
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomerMe } from "@/features/auth/services/authService"; // 👈 2. Importa la función del servicio
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  // 3. Estados para manejar la carga y los datos del perfil
  const [profileData, setProfileData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 4. Función que se ejecuta al hacer clic en el botón
  const handleFetchProfile = async () => {
    setIsLoading(true);
    setProfileData(null); // Limpia los datos anteriores
    try {
      const response = await getCustomerMe();
      // Guardamos los datos como un string JSON formateado para mostrarlo fácilmente
      const formattedData = JSON.stringify(response.data, null, 2);
      setProfileData(formattedData);
      toast.success("Datos del perfil cargados exitosamente.");
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      toast.error("No se pudieron cargar los datos del perfil.");
      setProfileData("Error al cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAll = () => {
    logout(true); // Llama a logout con el parámetro 'true'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Panel del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            ¡Bienvenido de nuevo,{" "}
            <span className="font-semibold">{user?.email ?? "Usuario"}</span>!
          </p>

          {/* 5. El nuevo botón para llamar a la API */}
          <Button onClick={handleFetchProfile} disabled={isLoading}>
            {isLoading ? "Cargando..." : "Cargar Mi Perfil (API Call)"}
          </Button>

            <Button variant="destructive" onClick={() => logout()}>
              Cerrar Sesión
            </Button>

          <Button variant="outline" onClick={handleLogoutAll}>
              Cerrar todas las Sesiones
            </Button>

          {/* 6. Área para mostrar los datos de la API */}
          {profileData && (
            <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-md text-left text-sm overflow-x-auto">
              <code>{profileData}</code>
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
