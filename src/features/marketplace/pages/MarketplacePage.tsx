import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { listPublicRestaurants, type RestaurantCard as RestaurantCardType } from "../services/marketplaceService";
import { RestaurantCard } from "../components/RestaurantCard";
// 👇 CAMBIO: Importamos las piezas del componente de paginación
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function MarketplacePage() {
  const [restaurants, setRestaurants] = useState<RestaurantCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cityFilter, setCityFilter] = useState("");
  const [debouncedCityFilter] = useDebounce(cityFilter, 500);

  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listPublicRestaurants({
        page: page - 1,
        size: 9,
        city: debouncedCityFilter || undefined,
      });
      setRestaurants(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("No se pudieron cargar los restaurantes.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedCityFilter]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  useEffect(() => {
    setPage(1);
  }, [debouncedCityFilter]);

  return (
    <div className="space-y-8">
      {/* --- Header and Filter --- */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explora Restaurantes</h1>
        <p className="text-muted-foreground">Encuentra tu próxima comida favorita en nuestra selección de locales.</p>
        <div className="relative pt-4 max-w-sm">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar por ciudad..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* --- Restaurants Grid --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground">No se encontraron restaurantes con esos criterios.</p>
        </div>
      )}

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
    </div>
  );
}
