import { MobileEntityCard } from "@/components/shared/MobileEntityCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlatformRestaurantCard } from "../services/restaurantService";

interface Props {
  restaurants: PlatformRestaurantCard[];
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

export function RestaurantMobileList({
  restaurants,
  onDetail,
  onSuspend,
  onUnsuspend,
}: Props) {
  return (
    <div className="space-y-4 md:hidden">
      {restaurants.map((r) => (
        <MobileEntityCard
          key={r.id}
          title={r.name}
          subtitle={r.city || "Ciudad no especificada"}
          extra={
            <Badge variant={getStatusVariant(r.status)} className="mt-1">
              {r.status}
            </Badge>
          }
          actions={
            <>
              <Button size="sm" variant="outline" onClick={() => onDetail(r.id)}>
                Ver detalle
              </Button>
              {r.status !== "SUSPENDED" ? (
                <Button variant="destructive" size="sm" onClick={() => onSuspend(r)}>
                  Suspender
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => onUnsuspend(r)}>
                  Reactivar
                </Button>
              )}
            </>
          }
        />
      ))}
    </div>
  );
}
