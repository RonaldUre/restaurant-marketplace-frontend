import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type CartItem } from "@/context/cart-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  items: CartItem[];
  totalPrice: number;
  restaurantName: string | null;
}

export function OrderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  items,
  totalPrice,
  restaurantName,
}: Props) {
  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirma Tu Orden"
      description={`Estás a punto de crear una orden en "${restaurantName}".`}
      showCloseButton={!isLoading} // Hide close button while loading
    >
      <div className="space-y-4">
        <ScrollArea className="max-h-60 pr-4">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold">{item.quantity} x</span> {item.name}
                </div>
                <div className="font-mono">
                  {(item.priceAmount * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="font-mono">{totalPrice.toFixed(2)} {items[0]?.priceCurrency}</span>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Regresar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Creando orden..." : "Confirmar y Crear Orden"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
