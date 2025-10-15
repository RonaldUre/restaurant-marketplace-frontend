import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type OrderCardResponse } from "../services/orderingService";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  isLoading: boolean;
  order: OrderCardResponse | null;
}

export function ConfirmCancelModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  order,
}: Props) {
  const [reason, setReason] = useState("");

  if (!isOpen || !order) return null;

  const handleConfirm = () => {
    onConfirm(reason || undefined);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Cancelar Orden #${order.id}`}
      description="¿Estás seguro de que deseas cancelar esta orden?"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Esta acción no se puede deshacer.
        </p>
        <div>
          <label htmlFor="cancel-reason" className="text-sm font-medium">Razón (Opcional)</label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Me equivoqué de productos"
            className="mt-1"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            No, volver
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Sí, cancelar orden"
            )}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}