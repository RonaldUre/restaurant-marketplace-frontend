import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type RestaurantCard as RestaurantCardType } from "../services/marketplaceService";
import { cn } from "@/lib/utils";

interface Props {
  restaurant: RestaurantCardType;
}

// Helper function to determine badge color based on status
const getStatusVariant = (status: RestaurantCardType["status"]) => {
  switch (status) {
    case "OPEN":
      return "success";
    case "CLOSED":
      return "secondary";
    case "SUSPENDED":
      return "destructive";
    default:
      return "default";
  }
};

export function RestaurantCard({ restaurant }: Props) {
  const isClickable = restaurant.status !== "SUSPENDED";

  const cardContent = (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        isClickable && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        !isClickable && "opacity-60 bg-muted"
      )}
    >
      <CardHeader className="p-0">
        {/* Placeholder for an image */}
        <img
          src={`https://placehold.co/600x400/gray/white?text=${restaurant.name.charAt(0)}`}
          alt={`Logo de ${restaurant.name}`}
          className="h-40 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{restaurant.name}</CardTitle>
          <Badge variant={getStatusVariant(restaurant.status)}>{restaurant.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{restaurant.city}</p>
        {!isClickable && (
           <p className="text-xs text-destructive pt-2">Este restaurante no está disponible actualmente.</p>
        )}
      </CardContent>
    </Card>
  );

  // The card is only a link if the restaurant is not suspended
  return isClickable ? (
    <Link to={`/restaurants/${restaurant.slug}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
      {cardContent}
    </Link>
  ) : (
    <div>{cardContent}</div>
  );
}