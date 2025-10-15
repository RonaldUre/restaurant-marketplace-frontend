// src/features/marketplace/pages/PaymentSuccessPage.tsx

// ✅ 1. Importa 'useRef'
import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { capturePayment } from "../services/orderingService";
import { Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ 2. Crea una referencia para controlar si la petición ya se ha enviado
  const captureCalled = useRef(false);

  useEffect(() => {
    // ✅ 3. Añade una condición para ejecutar la lógica solo una vez
    if (captureCalled.current) {
      return; // Si ya se llamó, no hagas nada más
    }
    captureCalled.current = true; // Marca que se va a llamar ahora

    const token = searchParams.get("token");
    const orderIdStr = localStorage.getItem("pending_payment_order_id");

    if (!token || !orderIdStr) {
      toast.error("Información de pago inválida o no encontrada.");
      navigate("/my-orders");
      return;
    }

    const orderId = parseInt(orderIdStr, 10);

    const handleCapturePayment = async () => {
      try {
        await capturePayment(orderId, { paymentProviderOrderId: token });
        
        toast.success("¡Pago completado exitosamente!", {
          description: "Tu orden ha sido actualizada.",
        });

      } catch (error) {
        console.error("Error capturing payment:", error);
        toast.error("Hubo un error al confirmar tu pago.", {
          description: "Por favor, contacta a soporte si el problema persiste.",
        });
      } finally {
        localStorage.removeItem("pending_payment_order_id");
        navigate("/my-orders");
      }
    };

    handleCapturePayment();
    
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h1 className="text-2xl font-semibold">Procesando tu pago...</h1>
      <p className="text-muted-foreground">Por favor, no cierres esta ventana.</p>
    </div>
  );
}