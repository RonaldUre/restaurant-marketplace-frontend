import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// 👇 CAMBIO: Separamos las importaciones
import { useCart } from "@/hooks/useCart";
import { type CartItem } from "@/context/cart-context"; // 👈 Obtenemos el tipo desde su nuevo hogar
import { Trash2, Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartSheetProps {
  children: React.ReactNode; // The trigger button
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void; // Function to start the checkout process
}

export function CartSheet({ children, isOpen, onOpenChange, onCheckout }: CartSheetProps) {
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    updateItemQuantity,
    clearCart,
    restaurantName,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Tu Carrito ({totalItems})</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <div className="text-sm text-muted-foreground">
              Ordenando de: <span className="font-semibold text-primary">{restaurantName}</span>
            </div>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateItemQuantity}
                  />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto space-y-4 border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} {items[0]?.priceCurrency}</span>
              </div>
               <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearCart}
              >
                Vaciar Carrito
              </Button>
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  onOpenChange(false); // Close sheet
                  onCheckout(); // Start checkout
                }}
              >
                Realizar Pedido
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Sub-componente para cada fila del carrito
function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, qty: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={`https://placehold.co/100x100/e2e8f0/334155?text=${item.name.charAt(0)}`}
        alt={item.name}
        className="h-16 w-16 rounded-md object-cover"
      />
      <div className="flex-1 space-y-1">
        <div className="font-semibold">{item.name}</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-4 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-semibold">
          {(item.priceAmount * item.quantity).toFixed(2)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}