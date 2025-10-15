import { createContext } from "react";
import type { PublicProductCard } from "@/features/marketplace/services/marketplaceService";

// --- Type Definitions ---
export interface CartItem extends PublicProductCard {
  quantity: number;
}
interface CartState {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string | null;
}
export interface CartContextType extends CartState {
  addItem: (product: PublicProductCard, restaurant: { id: number; name: string }) => void;
  removeItem: (productId: number) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// --- Context Definition ---
// Este archivo ahora solo exporta el contexto y los tipos, cumpliendo con la regla.
export const CartContext = createContext<CartContextType | undefined>(undefined);
