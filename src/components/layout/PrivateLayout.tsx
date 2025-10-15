import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Header } from "./Header";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { OrderConfirmationModal } from "@/features/marketplace/components/OrderConfirmationModal"; // 👈 1. Importar el nuevo modal
import { placeOrder } from "@/features/marketplace/services/orderingService"; // 👈 2. Importar el servicio de órdenes

export default function PrivateLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for the new confirmation modal flow
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { items, restaurantId, restaurantName, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // Esta función, llamada desde el carrito, AHORA SOLO ABRE EL MODAL de confirmación
  const handleCheckout = () => {
    if (!restaurantId || items.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }
    setIsConfirmationModalOpen(true); // Abre el modal
  };

  // Esta nueva función se ejecuta al hacer clic en "Confirmar" DENTRO DEL MODAL
  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) return;
    
    setIsPlacingOrder(true);
    try {
      const payload = {
        restaurantId,
        items: items.map(item => ({ productId: item.id, qty: item.quantity })),
      };
      
      await placeOrder(payload);

      toast.success("¡Orden creada exitosamente!", {
        description: "Serás redirigido a la página de 'Mis Órdenes' para gestionarla.",
      });

      clearCart();
      setIsConfirmationModalOpen(false);
      navigate('/my-orders'); // Redirige a la página de "Mis Órdenes"

    } catch (error) {
      console.error("Error al crear la orden:", error);
      toast.error("No se pudo crear la orden. Inténtalo de nuevo.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Sidebar para Desktop --- */}
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar />
      </div>

      {/* --- Sidebar para Móvil (Sheet) --- */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 flex flex-col">
          {/* Ahora pasamos las props correctas que tu Sidebar espera */}
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-col">
        {/* --- Cabecera con ícono de menú y carrito --- */}
        <Header 
          onMenuClick={() => setMobileMenuOpen(true)} 
          onCheckout={handleCheckout} 
        />
        
        {/* --- Contenido Principal --- */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* --- Render del Modal de Confirmación --- */}
      <OrderConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handlePlaceOrder}
        isLoading={isPlacingOrder}
        items={items}
        totalPrice={totalPrice}
        restaurantName={restaurantName}
      />
    </div>
  );
}
