import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  getPublicRestaurantBySlug,
  listPublicProducts,
  getPublicProductDetail,
  type RestaurantPublicDetail,
  type PublicProductCard,
  type PublicProductDetail,
} from "../services/marketplaceService";
import { RestaurantHeader } from "../components/RestaurantHeader";
import { ProductCard } from "../components/ProductCard";
import { ProductDetailModal } from "../components/ProductDetailModal";
// 👇 CAMBIO: Importamos las piezas del componente de paginación
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // State for restaurant and products
  const [restaurant, setRestaurant] = useState<RestaurantPublicDetail | null>(null);
  const [products, setProducts] = useState<PublicProductCard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for loading indicators
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // State for the product detail modal
  const [selectedProduct, setSelectedProduct] = useState<PublicProductCard | null>(null);
  const [detailedProduct, setDetailedProduct] = useState<PublicProductDetail | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Fetch restaurant details
  useEffect(() => {
    if (!slug) {
      toast.error("No se ha especificado un restaurante.");
      setIsRestaurantLoading(false);
      return;
    }
    setIsRestaurantLoading(true);
    getPublicRestaurantBySlug(slug)
      .then((res) => setRestaurant(res.data))
      .catch(() => toast.error("No se pudo encontrar el restaurante."))
      .finally(() => setIsRestaurantLoading(false));
  }, [slug]);

  // Fetch products when restaurant is loaded or page changes
  const fetchProducts = useCallback(async () => {
    if (!restaurant) return;
    setIsProductsLoading(true);
    try {
      const res = await listPublicProducts(restaurant.id, { page: page - 1, size: 8 });
      setProducts(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("No se pudieron cargar los productos de este restaurante.");
    } finally {
      setIsProductsLoading(false);
    }
  }, [restaurant, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Fetch detailed product info when a product is selected
  useEffect(() => {
    if (!selectedProduct || !restaurant) return;
    setIsModalLoading(true);
    setDetailedProduct(null);
    getPublicProductDetail(restaurant.id, selectedProduct.id)
      .then((res) => setDetailedProduct(res.data))
      .catch(() => toast.error("No se pudo cargar el detalle del producto."))
      .finally(() => setIsModalLoading(false));
  }, [selectedProduct, restaurant]);

  // --- Render Logic ---

  if (isRestaurantLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Restaurante no encontrado</h2>
        <p className="text-muted-foreground">El enlace puede ser incorrecto o el restaurante ya no está disponible.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/marketplace">Volver al Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/marketplace" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a todos los restaurantes
      </Link>
      
      <RestaurantHeader restaurant={restaurant} />
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Menú</h2>
        {isProductsLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <p className="text-muted-foreground">Este restaurante no tiene productos disponibles en este momento.</p>
          </div>
        )}
      </div>

      {/* 👇 CAMBIO: Implementación correcta de la paginación */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm font-medium">
                Página {page} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isLoading={isModalLoading}
        product={detailedProduct}
      />
    </div>
  );
}