import { useState } from "react";
import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PlatformRestaurantCard } from "../services/restaurantService";

type ActionType = "suspend" | "unsuspend";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number, reason?: string) => void;
  restaurant: PlatformRestaurantCard | null;
  action: ActionType | null;
}

export function ConfirmRestaurantActionModal({
  isOpen,
  onClose,
  onConfirm,
  restaurant,
  action,
}: Props) {
  const [reason, setReason] = useState("");

  if (!restaurant || !action) return null;

  const isSuspending = action === "suspend";

  const title = isSuspending
    ? `¿Suspender restaurante?`
    : `¿Reactivar restaurante?`;
  const description = `Estás a punto de ${
    isSuspending ? "suspender" : "reactivar"
  } el restaurante:`;
  const confirmLabel = isSuspending ? "Sí, suspender" : "Sí, reactivar";
  const confirmVariant = isSuspending ? "destructive" : "default";

  const handleConfirm = () => {
    onConfirm(restaurant.id, isSuspending ? reason : undefined);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm">
          {description} <strong>{restaurant.name}</strong>
        </p>

        {isSuspending && (
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Textarea
              id="reason"
              placeholder="Ej: Incumplimiento de políticas."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
