import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Calendar,
  FileText,
  LogOut,
  Scissors,
  User,
  PowerOff, // Icono adicional para diferenciar
} from "lucide-react";

type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

// Navegación para Administradores
const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  { label: "Clientes", path: "/clients", icon: <Users className="w-5 h-5" /> },
  { label: "Usuarios", path: "/users", icon: <Users className="w-5 h-5" /> },
  {
    label: "Citas",
    path: "/appointments",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: "Servicios",
    path: "/services",
    icon: <Scissors className="w-5 h-5" />,
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: <FileText className="w-5 h-5" />,
  },
];

// Navegación para Clientes
const customerNavItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Mi Perfil",
    path: "/profile",
    icon: <User className="w-5 h-5" />,
  },
  // Aquí se podrían añadir más rutas específicas para clientes en el futuro
];

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogoutAll = () => {
    logout(true); // Llama a logout con el parámetro para cerrar todas las sesiones
  };

  const isAdmin =
    user?.role === "RESTAURANT_ADMIN" || user?.role === "SUPER_ADMIN";
  const navItems = isAdmin ? adminNavItems : customerNavItems;

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted"
    }`;

  return (
    <aside
      className={`${
        isMobile ? "w-full" : "w-64"
      } flex h-screen flex-col border-r bg-background`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <span className="text-lg font-bold tracking-tight text-primary">
          Marketplace
        </span>
      </div>

      {/* Contenido Desplazable */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, path, icon }) => (
            <NavLink key={path} to={path} className={getNavLinkClass}>
              <span className="text-muted-foreground">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer con información de usuario y botones de logout */}
      <div className="space-y-2 border-t p-4 text-xs text-muted-foreground">
        <div className="mb-2">
          <div className="font-medium text-foreground">{user?.email}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
            {user?.role.replace(/_/g, " ")}
          </div>
        </div>

        {/* --- 👇 BOTONES DE LOGOUT ACTUALIZADOS 👇 --- */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogoutAll}
          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <PowerOff className="h-4 w-4" />
          Cerrar todas las Sesiones
        </Button>
      </div>
    </aside>
  );
}
