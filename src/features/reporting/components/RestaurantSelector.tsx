"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getAllRestaurantsForSelect,
  type RestaurantSelectItem,
} from "@/features/restaurant/services/restaurantService";
import { Skeleton } from "@/components/ui/skeleton";

interface RestaurantSelectorProps {
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  className?: string;
}

export function RestaurantSelector({
  selectedId,
  onSelect,
  className,
}: RestaurantSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [restaurants, setRestaurants] = React.useState<RestaurantSelectItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    getAllRestaurantsForSelect()
      .then((res) => {
        setRestaurants(res.data);
      })
      .catch(() => {
        // En un caso real, podrías mostrar un toast de error aquí
        console.error("Failed to fetch restaurants for selector");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const selectedRestaurantName =
    restaurants.find((r) => r.id === selectedId)?.name || "Seleccionar restaurante...";

  if (isLoading) {
    return <Skeleton className={cn("w-[250px] h-10", className)} />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[250px] justify-between", className)}
        >
          <span className="truncate">{selectedRestaurantName}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar restaurante..." />
          <CommandList>
            <CommandEmpty>No se encontraron restaurantes.</CommandEmpty>
            <CommandGroup>
              {restaurants.map((restaurant) => (
                <CommandItem
                  key={restaurant.id}
                  value={restaurant.name} // El valor para la búsqueda
                  onSelect={() => {
                    onSelect(restaurant.id === selectedId ? null : restaurant.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === restaurant.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {restaurant.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
