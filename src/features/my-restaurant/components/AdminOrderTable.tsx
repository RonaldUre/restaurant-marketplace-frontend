import { CrudTable } from "@/components/shared/CrudTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type OrderCardResponse } from "@/features/marketplace/services/orderingService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  orders: OrderCardResponse[];
  isLoading: boolean;
  onViewDetails: (order: OrderCardResponse) => void;
  onCancel: (order: OrderCardResponse) => void;
  onConfirmPayment: (order: OrderCardResponse) => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "PAID": return "success";
    case "CANCELLED": return "destructive";
    case "PENDING": return "secondary";
    default: return "default";
  }
};

export function AdminOrderTable({ orders, isLoading, onViewDetails, onCancel, onConfirmPayment }: Props) {
  const columns = [
    { header: "ID Orden", render: (o: OrderCardResponse) => `#${o.id}` },
    {
      header: "Fecha",
      render: (o: OrderCardResponse) => format(new Date(o.createdAt), "P", { locale: es }),
    },
    {
      header: "Estado",
      render: (o: OrderCardResponse) => <Badge variant={getStatusVariant(o.status)}>{o.status}</Badge>,
    },
    {
        header: "Nº Productos",
        render: (o: OrderCardResponse) => o.itemsCount,
    },
    {
      header: "Total",
      render: (o: OrderCardResponse) => `${o.totalAmount.toFixed(2)} ${o.currency}`,
    },
    {
      header: "Acciones",
      render: (o: OrderCardResponse) => (
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onViewDetails(o)}>
            Detalles
          </Button>
          {o.status === "PENDING" && (
            <>
              <Button size="sm" variant="destructive" onClick={() => onCancel(o)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={() => onConfirmPayment(o)}>
                Confirmar Pago
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return <CrudTable<OrderCardResponse> data={orders} columns={columns} isLoading={isLoading} emptyMessage="No se encontraron órdenes." />;
}