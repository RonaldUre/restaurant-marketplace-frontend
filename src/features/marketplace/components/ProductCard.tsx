import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type PublicProductCard as ProductCardType } from "../services/marketplaceService";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  product: ProductCardType;
  isRestaurantOpen: boolean;
  onCardClick: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, isRestaurantOpen, onCardClick, onAddToCart }: Props) {
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  // The card is actionable if the restaurant is open AND the product is available
  const isActionable = isRestaurantOpen && product.available;

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden transition-all duration-200 h-full",
        isActionable ? "hover:shadow-lg cursor-pointer" : "opacity-60 grayscale-[50%]"
      )}
      onClick={isActionable ? onCardClick : undefined}
    >
      <CardHeader className="p-0">
        <div className="aspect-video bg-muted flex items-center justify-center relative">
            {/* Show "Agotado" badge if not available */}
            {!product.available && (
              <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                Agotado
              </Badge>
            )}
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
            // Disable button if not actionable
            disabled={!isActionable}
         >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Añadir
         </Button>
      </CardFooter>
    </Card>
  );
}