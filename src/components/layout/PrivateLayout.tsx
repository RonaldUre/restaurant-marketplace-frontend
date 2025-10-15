import { useState } from "react";
import { Outlet} from "react-router-dom"; // 👈 Importa useNavigate
import Sidebar from "./Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Header } from "./Header"; // 👈 Importa el nuevo Header
import { useCart } from "@/hooks/useCart"; // Importamos el hook del carrito
import { toast } from "sonner";

export default function PrivateLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { restaurantId, items } = useCart(); // Obtenemos datos del carrito

  // 👇 Lógica para el botón "Realizar Pedido"
  const handleCheckout = () => {
    if (!restaurantId || items.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }
    // Por ahora, solo es un placeholder. Más adelante aquí llamaremos a la API.
    console.log("Iniciando checkout para el restaurante:", restaurantId);
    console.log("Items:", items);
    toast.info("Iniciando el proceso de checkout...");
    // navigate('/checkout'); // Descomentar cuando creemos la página de checkout
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
          <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
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
    </div>
  );
}
