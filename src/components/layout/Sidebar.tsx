import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Home,
  LogOut,
  X,
  User,
  Receipt,
  Store, // Icono para Restaurantes
  PowerOff, // Icono para Cerrar Todas las Sesiones
} from "lucide-react";

// 👇 1. Se añade 'isMobile' a las props
type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

// --- NAVEGACIÓN POR ROL ---
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
];
const restaurantAdminNavItems = [
  {
    label: "Mi Restaurant",
    path: "/admin/my-restaurant",
    icon: <Store className="h-5 w-5" />,
  },
];
const customerNavItems = [
  {
    label: "Mi Perfil",
    path: "/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    label: "Marketplace",
    path: "/marketplace",
    icon: <Store className="h-5 w-5" />,
  },
    {
    label: "Mis Órdenes",
    path: "/my-orders",
    icon: <Receipt className="h-5 w-5" />,
  },
];

// 👇 2. El componente ahora acepta y usa 'isMobile'
export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  let navItems = customerNavItems;
  if (user?.role === "SUPER_ADMIN") {
    navItems = superAdminNavItems;
  } else if (user?.role === "RESTAURANT_ADMIN") {
    navItems = restaurantAdminNavItems;
  }

  const handleLogoutAll = () => {
    logout(true);
  };

  // 👇 3. Función segura para cerrar el menú solo en móvil
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    // 👇 4. El ancho ahora es dinámico
    <aside className={`flex h-screen flex-col border-r bg-background ${isMobile ? 'w-full' : 'w-64'}`}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <span className="text-lg font-bold tracking-tight text-primary">
          Marketplace
        </span>
        {/* El botón de cerrar solo aparece si 'onClose' se pasa (típicamente en móvil) */}
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
              onClick={handleLinkClick} // Usamos la nueva función
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
            {/* Corregido para reemplazar todos los guiones bajos */}
            {user?.role.replace(/_/g, " ")}
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
