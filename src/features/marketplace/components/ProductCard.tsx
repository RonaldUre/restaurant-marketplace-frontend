import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type PublicProductCard as ProductCardType } from "../services/marketplaceService";

interface Props {
  product: ProductCardType;
  onClick: () => void; // Function to handle click, e.g., open a modal
}

export function ProductCard({ product, onClick }: Props) {
  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        {/* Placeholder for a product image */}
        <div className="aspect-video bg-muted flex items-center justify-center">
            <img 
              src={`https://placehold.co/400x300/e2e8f0/334155?text=${product.name.charAt(0)}`}
              alt={`Imagen de ${product.name}`}
              className="h-full w-full object-cover"
            />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold">{product.name}</CardTitle>
          <div className="text-base font-bold text-primary whitespace-nowrap">
            {product.priceAmount.toFixed(2)} {product.priceCurrency}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardContent>
    </Card>
  );
}