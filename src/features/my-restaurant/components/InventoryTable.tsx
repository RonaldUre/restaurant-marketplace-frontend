import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CrudTable } from "@/components/shared/CrudTable";
import { type InventoryAdminItem } from "../services/inventoryAdminService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Definimos explícitamente las props que el componente espera recibir
interface Props {
  items: InventoryAdminItem[];
  isLoading: boolean;
  onAdjustStock: (item: InventoryAdminItem) => void;
  onSwitchToLimited: (item: InventoryAdminItem) => void;
  onSwitchToUnlimited: (item: InventoryAdminItem) => void;
}

export function InventoryTable({
  items,
  isLoading,
  onAdjustStock,
  onSwitchToLimited,
  onSwitchToUnlimited,
}: Props) {
  const columns = [
    {
      header: "Producto",
      render: (item: InventoryAdminItem) => (
        <div className="text-left">
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.sku}</div>
        </div>
      ),
    },
    {
      header: "Stock",
      render: (item: InventoryAdminItem) => (
        <div>
          {item.unlimited ? (
            <Badge variant="secondary">Ilimitado</Badge>
          ) : (
            <span className="font-mono">{item.available}</span>
          )}
        </div>
      ),
    },
    {
      header: "Reservado",
      render: (item: InventoryAdminItem) => (
        <span className="font-mono">{item.reserved}</span>
      ),
    },
    {
      header: "Últ. Actualización",
      render: (item: InventoryAdminItem) =>
        format(new Date(item.updatedAt), "PP", { locale: es }),
    },
    {
      header: "Acciones",
      render: (item: InventoryAdminItem) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAdjustStock(item)}
            disabled={item.unlimited}
          >
            Ajustar
          </Button>
          {item.unlimited ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSwitchToLimited(item)}
            >
              Pasar a Limitado
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSwitchToUnlimited(item)}
            >
              Pasar a Ilimitado
            </Button>
          )}
        </div>
      ),
    },
  ];

  return <CrudTable<InventoryAdminItem> data={items} isLoading={isLoading} columns={columns} />;
}
