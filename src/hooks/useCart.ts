import { useContext } from "react";
// 👇 CAMBIO: Importamos desde el nuevo archivo 'cart-context.ts'
import { CartContext, type CartContextType } from "@/context/cart-context";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
