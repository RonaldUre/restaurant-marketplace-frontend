import { CrudTable } from "@/components/shared/CrudTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlatformRestaurantCard } from "../services/restaurantService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  restaurants: PlatformRestaurantCard[];
  isLoading: boolean;
  onDetail: (id: number) => void;
  onSuspend: (restaurant: PlatformRestaurantCard) => void;
  onUnsuspend: (restaurant: PlatformRestaurantCard) => void;
}

// Helper para dar color a los badges de estado
const getStatusVariant = (status: PlatformRestaurantCard["status"]) => {
  switch (status) {
    case "OPEN":
      return "success";
    case "SUSPENDED":
      return "destructive";
    case "CLOSED":
    default:
      return "secondary";
  }
};

export function RestaurantTable({
  restaurants,
  isLoading,
  onDetail,
  onSuspend,
  onUnsuspend,
}: Props) {
  const columns = [
    {
      header: "Nombre",
      render: (r: PlatformRestaurantCard) => r.name,
    },
    {
      header: "Slug",
      render: (r: PlatformRestaurantCard) => <code className="text-sm">/{r.slug}</code>,
    },
    {
      header: "Estado",
      render: (r: PlatformRestaurantCard) => (
        <Badge variant={getStatusVariant(r.status)}>{r.status}</Badge>
      ),
    },
    {
      header: "Ciudad",
      render: (r: PlatformRestaurantCard) => r.city || "N/A",
    },
    {
      header: "Creado",
      render: (r: PlatformRestaurantCard) =>
        format(new Date(r.createdAt), "dd MMM yyyy", { locale: es }),
    },
    {
      header: "Acciones",
      render: (r: PlatformRestaurantCard) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onDetail(r.id)}>
            Detalle
          </Button>
          {r.status !== "SUSPENDED" ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onSuspend(r)}
            >
              Suspender
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUnsuspend(r)}
            >
              Reactivar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="hidden md:block">
      <CrudTable<PlatformRestaurantCard>
        data={restaurants}
        isLoading={isLoading}
        columns={columns}
        emptyMessage="No se encontraron restaurantes."
      />
    </div>
  );
}
