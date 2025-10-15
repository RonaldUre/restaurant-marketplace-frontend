import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type PublicProductCard as ProductCardType } from "../services/marketplaceService";
import { ShoppingCart } from "lucide-react";

interface Props {
  product: ProductCardType;
  isRestaurantOpen: boolean;
  onCardClick: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, isRestaurantOpen, onCardClick, onAddToCart }: Props) {
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
    onAddToCart();
  };

  return (
    <Card
      className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer h-full"
      onClick={onCardClick}
    >
      <CardHeader className="p-0">
        <div className="aspect-video bg-muted flex items-center justify-center">
            <img 
              src={`https://placehold.co/400x300/e2e8f0/334155?text=${product.name.charAt(0)}`}
              alt={`Imagen de ${product.name}`}
              className="h-full w-full object-cover"
            />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold">{product.name}</CardTitle>
          <div className="text-base font-bold text-primary whitespace-nowrap">
            {product.priceAmount.toFixed(2)} {product.priceCurrency}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Button 
            className="w-full"
            onClick={handleAddToCartClick}
            disabled={!isRestaurantOpen} // El botón se deshabilita si el restaurante está cerrado
         >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Añadir
         </Button>
      </CardFooter>
    </Card>
  );
}
