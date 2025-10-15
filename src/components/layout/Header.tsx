import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartSheet } from "@/features/marketplace/components/CartSheet";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
  onCheckout: () => void; // Prop to trigger checkout flow
}

export function Header({ onMenuClick, onCheckout }: HeaderProps) {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // El carrito solo es visible para los clientes
  const isCustomer = user?.role === "CUSTOMER";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      {/* Botón de Menú para móvil */}
      <Button variant="outline" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      {/* Placeholder para breadcrumbs o título de página si lo necesitas en el futuro */}
      <div className="flex-1"></div>

      {/* Ícono del Carrito, solo para clientes */}
      {isCustomer && (
        <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} onCheckout={onCheckout}>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
        </CartSheet>
      )}
    </header>
  );
}
