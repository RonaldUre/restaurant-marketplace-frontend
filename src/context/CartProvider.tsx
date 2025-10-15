import { useReducer, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
// 👇 CAMBIO: Importamos el contexto y los tipos desde el nuevo archivo
import { CartContext, type CartContextType, type CartItem } from "./cart-context";
import type { PublicProductCard } from "@/features/marketplace/services/marketplaceService";

// --- Type Definitions (solo las que se usan aquí) ---
interface CartState {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string | null;
}
type CartAction =
  | { type: "ADD_ITEM"; payload: { product: PublicProductCard; restaurant: { id: number; name: string } } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_STATE"; payload: CartState };

// --- Reducer (sin cambios) ---
const cartReducer = (state: CartState, action: CartAction): CartState => {
    // ... la lógica del reducer no cambia ...
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, restaurant } = action.payload;
      if (state.restaurantId && state.restaurantId !== restaurant.id) {
        toast.error("Solo puedes añadir productos del mismo restaurante a la vez.", {
            description: `Vacía tu carrito para ordenar de "${restaurant.name}".`,
        });
        return state;
      }
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return {
          ...state,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          items: [...state.items, { ...product, quantity: 1 }],
        };
      }
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload.productId);
      const shouldResetRestaurant = newItems.length === 0;
      return {
        ...state,
        items: newItems,
        restaurantId: shouldResetRestaurant ? null : state.restaurantId,
        restaurantName: shouldResetRestaurant ? null : state.restaurantName,
      };
    }
    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== productId);
        const shouldResetRestaurant = newItems.length === 0;
        return {
            ...state,
            items: newItems,
            restaurantId: shouldResetRestaurant ? null : state.restaurantId,
            restaurantName: shouldResetRestaurant ? null : state.restaurantName,
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [], restaurantId: null, restaurantName: null };
    case "SET_STATE":
      return action.payload;
    default:
      return state;
  }
};

// --- Provider Component (este es ahora el único export) ---
const CART_STORAGE_KEY = "marketplace-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    restaurantId: null,
    restaurantName: null,
  });
  useEffect(() => {
    try {
      const storedState = localStorage.getItem(CART_STORAGE_KEY);
      if (storedState) {
        dispatch({ type: "SET_STATE", payload: JSON.parse(storedState) });
      }
    } catch (error) {
        console.error("Failed to load cart from localStorage", error);
        localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);
  useEffect(() => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save cart to localStorage", error);
    }
  }, [state]);

  const contextValue: CartContextType = {
    ...state,
    addItem: (product, restaurant) => dispatch({ type: "ADD_ITEM", payload: { product, restaurant } }),
    removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
    updateItemQuantity: (productId, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    totalItems: state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: state.items.reduce((total, item) => total + item.priceAmount * item.quantity, 0),
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
