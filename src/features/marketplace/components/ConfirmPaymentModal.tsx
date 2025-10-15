import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/ui/button";
import { type OrderCardResponse } from "../services/orderingService";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  order: OrderCardResponse | null;
}

export function ConfirmPaymentModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  order,
}: Props) {
  if (!isOpen || !order) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pagar Orden #${order.id}`}
      description="Serás redirigido a PayPal para completar el pago de forma segura."
    >
      <div className="space-y-4">
        <div className="rounded-md border bg-muted p-4">
          <div className="flex justify-between font-semibold">
            <span>Total a Pagar:</span>
            <span>{order.totalAmount.toFixed(2)} {order.currency}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Volver
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirigiendo...
              </>
            ) : (
              "Continuar a PayPal"
            )}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}