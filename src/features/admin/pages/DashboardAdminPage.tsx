// src/features/admin/pages/DashboardAdminPage.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardAdminPage() {
  const { user, logout } = useAuth();

  const handleLogoutAll = () => {
    logout(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-lg bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Panel de Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Sesión iniciada como:{" "}
            <span className="font-semibold text-amber-400">{user?.email}</span>
          </p>
          <p className="text-slate-300">
            Rol de usuario:{" "}
            <span className="font-semibold text-amber-400">{user?.role}</span>
          </p>
          
          <Button variant="destructive" onClick={() => logout()}>
            Cerrar Sesión
          </Button>

          {/* 👇 EL NUEVO BOTÓN 👇 */}
          <Button
            variant="outline"
            className="bg-slate-700 hover:bg-slate-600"
            onClick={handleLogoutAll}
          >
            Cerrar todas las Sesiones
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
