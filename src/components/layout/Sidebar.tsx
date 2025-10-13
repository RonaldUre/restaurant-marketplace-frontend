import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  LogOut,
  X,
  User,
  Store, // Icono para Restaurantes
  PowerOff, // Icono para Cerrar Todas las Sesiones
} from "lucide-react";

type SidebarProps = {
  // El único prop que necesita es la función para cerrarse (en vista móvil)
  onClose?: () => void;
};

// --- NAVEGACIÓN POR ROL ---

// 1. Para SUPER_ADMIN
const superAdminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Restaurantes",
    path: "/admin/restaurants",
    icon: <Store className="h-5 w-5" />,
  },
  {
    label: "Usuarios",
    path: "/admin/users", // Asumiendo una futura ruta
    icon: <Users className="h-5 w-5" />,
  },
];

// 2. Para RESTAURANT_ADMIN
const restaurantAdminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  // NOTA: En la Fase 2, aquí iría el enlace a "Mi Restaurante"
];

// 3. Para CUSTOMER
const customerNavItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Mi Perfil",
    path: "/profile",
    icon: <User className="h-5 w-5" />,
  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth(); // Obtenemos ambas funciones

  // Lógica para determinar qué menú mostrar
  let navItems = customerNavItems; // Por defecto, el de cliente
  if (user?.role === "SUPER_ADMIN") {
    navItems = superAdminNavItems;
  } else if (user?.role === "RESTAURANT_ADMIN") {
    navItems = restaurantAdminNavItems;
  }

  const handleLogoutAll = () => {
    logout(true); // Llama a logout con el parámetro para cerrar todas las sesiones
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <span className="text-lg font-bold tracking-tight text-primary">
          Marketplace
        </span>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Contenido Desplazable */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose} // Cierra el menú móvil al hacer clic
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-2 border-t p-4 text-sm">
        <div className="mb-2">
          <div className="truncate font-medium text-foreground">
            {user?.email}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
            {user?.role.replace("_", " ")}
          </div>
        </div>
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogoutAll}
            className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <PowerOff className="h-4 w-4" />
            Cerrar todas las Sesiones
          </Button>
        </div>
      </div>
    </aside>
  );
}
