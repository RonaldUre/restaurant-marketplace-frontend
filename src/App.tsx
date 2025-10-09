// src/App.tsx
import AppRoutes from "@/router"; // Esto buscará el index.tsx dentro de la carpeta router
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster richColors />
    </>
  );
}

export default App;