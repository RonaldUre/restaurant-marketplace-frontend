// src/features/admin/pages/DashboardAdminPage.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardAdminPage() {
  const { user } = useAuth();

  return (
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
        
        </CardContent>
      </Card>
  );
}
