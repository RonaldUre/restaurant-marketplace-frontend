import { useEffect } from "react";
import { Link} from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {

    useEffect(() => {
        toast.warning("El proceso de pago fue cancelado.", {
            description: "Tu orden sigue pendiente de pago.",
        });
        localStorage.removeItem("pending_payment_order_id"); // Limpiamos por si acaso
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
            <h1 className="text-2xl font-semibold">Pago Cancelado</h1>
            <p className="text-muted-foreground">
                Has cancelado el proceso de pago. Tu orden no ha sido procesada.
            </p>
            <Button asChild>
                <Link to="/my-orders">Volver a Mis Órdenes</Link>
            </Button>
        </div>
    );
}