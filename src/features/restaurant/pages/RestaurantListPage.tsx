import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getPlatformRestaurants,
  getPlatformRestaurantById,
  suspendRestaurant,
  unsuspendRestaurant,
  type PlatformRestaurantCard,
  type RestaurantDetail,
} from "../services/restaurantService";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DetailModal } from "@/components/shared/DetailModal";
import { RestaurantTable } from "../components/RestaurantTable";
import { RestaurantMobileList } from "../components/RestaurantMobileList";
import { ConfirmRestaurantActionModal } from "../components/ConfirmRestaurantActionModal";

type ActionType = "suspend" | "unsuspend";

export default function RestaurantListPage() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [restaurants, setRestaurants] = useState<PlatformRestaurantCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1); // Mantenemos el estado de la UI 1-indexado
  const [totalPages, setTotalPages] = useState(1);

  // Estados para los modales
  const [detailRestaurant, setDetailRestaurant] = useState<RestaurantDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [actionState, setActionState] = useState<{
    restaurant: PlatformRestaurantCard | null;
    action: ActionType | null;
  }>({ restaurant: null, action: null });

  // --- LÓGICA DE DATOS ---
  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    try {
      // 👇 --- LA CORRECCIÓN ESTÁ AQUÍ --- 👇
      // Restamos 1 a la página al enviarla a la API
      const res = await getPlatformRestaurants({ page: page - 1, size: 5 });
      setRestaurants(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error al cargar restaurantes:", error);
      toast.error("No se pudieron cargar los restaurantes.");
    } finally {
      setIsLoading(false);
    }
  }, [page]); // La dependencia sigue siendo 'page'

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // --- MANEJADORES DE EVENTOS ---
  const handleOpenDetailModal = async (id: number) => {
    setIsDetailLoading(true);
    setDetailRestaurant(null);
    try {
      const res = await getPlatformRestaurantById(id);
      setDetailRestaurant(res.data);
    } catch (error) {
        console.error("Error al cargar el detalle del restaurante:", error);
      toast.error("No se pudo cargar el detalle del restaurante.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleOpenActionModal = (
    restaurant: PlatformRestaurantCard,
    action: ActionType
  ) => {
    setActionState({ restaurant, action });
  };

  const handleConfirmAction = async (id: number, reason?: string) => {
    const { action } = actionState;
    const isSuspending = action === "suspend";
    const actionPromise = isSuspending
      ? suspendRestaurant(id, reason)
      : unsuspendRestaurant(id);

    const toastMessage = isSuspending
      ? "Restaurante suspendido."
      : "Restaurante reactivado.";

    try {
      await actionPromise;
      toast.success(toastMessage);
      fetchRestaurants();
    } catch (error) {
      console.error(`Error al ${action} restaurante:`, error);
      toast.error(`No se pudo ${action} el restaurante.`);
    } finally {
      setActionState({ restaurant: null, action: null });
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de Restaurantes
        </h1>
        <Button onClick={() => navigate("/admin/restaurants/new")}>
          + Nuevo Restaurante
        </Button>
      </div>

      <RestaurantMobileList
        restaurants={restaurants}
        onDetail={handleOpenDetailModal}
        onSuspend={(r) => handleOpenActionModal(r, "suspend")}
        onUnsuspend={(r) => handleOpenActionModal(r, "unsuspend")}
      />

      <RestaurantTable
        restaurants={restaurants}
        isLoading={isLoading}
        onDetail={handleOpenDetailModal}
        onSuspend={(r) => handleOpenActionModal(r, "suspend")}
        onUnsuspend={(r) => handleOpenActionModal(r, "unsuspend")}
      />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePreviousPage();
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm font-medium px-4">
                Página {page} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <>
        <DetailModal
          isOpen={!!detailRestaurant || isDetailLoading}
          onClose={() => setDetailRestaurant(null)}
          title="Detalle del Restaurante"
          loading={isDetailLoading}
          fields={[
            { label: "ID", value: detailRestaurant?.id },
            { label: "Nombre", value: detailRestaurant?.name },
            { label: "Slug", value: detailRestaurant?.slug },
            { label: "Email Contacto", value: detailRestaurant?.email },
            { label: "Teléfono", value: detailRestaurant?.phone },
            { label: "Ciudad", value: detailRestaurant?.address?.city },
            { label: "País", value: detailRestaurant?.address?.country },
            { label: "Estado", value: detailRestaurant?.status },
          ]}
        />
        <ConfirmRestaurantActionModal
          isOpen={!!actionState.restaurant}
          onClose={() => setActionState({ restaurant: null, action: null })}
          restaurant={actionState.restaurant}
          action={actionState.action}
          onConfirm={handleConfirmAction}
        />
      </>
    </div>
  );
}
