import { BaseModal } from "@/components/shared/BaseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { type PublicProductDetail } from "../services/marketplaceService";

interface Props {
  product: PublicProductDetail | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isLoading, isOpen, onClose }: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={product?.name || "Cargando..."}
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-6 w-1/4 ml-auto" />
        </div>
      ) : product ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p>{product.description || "Este producto no tiene una descripción detallada."}</p>
          <p className="text-right text-lg font-bold text-primary">
            {product.priceAmount.toFixed(2)} {product.priceCurrency}
          </p>
        </div>
      ) : (
        <p>No se pudo cargar la información del producto.</p>
      )}
    </BaseModal>
  );
}