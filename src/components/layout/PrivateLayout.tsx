import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// 👇 1. Importa SheetHeader y SheetTitle
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function PrivateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* --- Sidebar para Escritorio --- */}
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* --- Contenido Principal --- */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 pt-20 md:pt-8">
        {/* --- Menú para Móvil (Botón y Sheet) --- */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full max-w-xs">
              {/* 👇 2. AÑADE UN TÍTULO ACCESIBLE E INVISIBLE 👇 */}
              <SheetHeader className="sr-only">
                <SheetTitle>Menú Principal</SheetTitle>
              </SheetHeader>
              <Sidebar isMobile onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* El contenido de la página actual se renderiza aquí */}
        <Outlet />
      </main>
    </div>
  );
}

