import { Badge } from "@/components/ui/badge";
import { type RestaurantPublicDetail } from "../services/marketplaceService";
import { MapPin, Phone, Mail } from "lucide-react";
import { isRestaurantOpenNow } from "@/lib/openingHours"; // 👈 1. Importar la función

interface Props {
  restaurant: RestaurantPublicDetail;
}

export function RestaurantHeader({ restaurant }: Props) {
  const fullAddress = [
    restaurant.address.line1,
    restaurant.address.city,
    restaurant.address.country,
  ]
    .filter(Boolean)
    .join(", ");
    
  // 2. 👇 Se calcula el estado real basándose en el horario
  // Primero se verifica que no esté suspendido y luego se consulta el horario en tiempo real.
  const isOpen = restaurant.status === "OPEN" && isRestaurantOpenNow(restaurant.openingHoursJson);
  const statusText = isOpen ? "Abierto ahora" : "Cerrado";
  const statusVariant = isOpen ? "success" : "destructive";

  return (
    <div className="w-full">
      <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-lg">
        <img
          src={`https://placehold.co/1200x400/cccccc/333333?text=${restaurant.name}`}
          alt={`Imagen de ${restaurant.name}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 space-y-2">
          {/* 3. 👇 Se usa el estado y la variante calculados */}
          <Badge variant={statusVariant} className="text-sm">
            {statusText}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {restaurant.name}
          </h1>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
        {fullAddress && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{fullAddress}</span>
          </div>
        )}
        {restaurant.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{restaurant.phone}</span>
          </div>
        )}
        {restaurant.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span>{restaurant.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

