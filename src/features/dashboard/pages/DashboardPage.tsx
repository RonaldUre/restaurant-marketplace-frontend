// src/features/dashboard/pages/DashboardPage.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
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
        <p>
          Rol de usuario:{" "}
          <span className="font-semibold">{user?.role}</span>
        </p>
      </CardContent>
    </Card>
  );
}
