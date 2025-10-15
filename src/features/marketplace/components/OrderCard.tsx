/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type OrderCardResponse } from "../services/orderingService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  order: OrderCardResponse;
  onPay: (order: OrderCardResponse) => void;
  onCancel: (order: OrderCardResponse) => void;
  onViewDetails: (order: OrderCardResponse) => void;
}

// Helper para obtener el color y texto del estado
const getStatusDetails = (status: string) => {
  switch (status) {
    case "PAID":
      return { variant: "success", text: "Pagada" };
    case "CANCELLED":
      return { variant: "destructive", text: "Cancelada" };
    case "PENDING":
      return { variant: "secondary", text: "Pendiente" };
    default:
      return { variant: "default", text: status };
  }
};

export function OrderCard({ order, onPay, onCancel, onViewDetails }: Props) {
  const statusDetails = getStatusDetails(order.status);
  const canTakeAction = order.status === "PENDING";

  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Orden #{order.id}</CardTitle>
          <CardDescription>
            Realizada el {format(new Date(order.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
          </CardDescription>
        </div>
        <div className="flex items-center justify-end">
            <Badge variant={statusDetails.variant as any} className="text-sm">
                {statusDetails.text}
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {order.itemsCount} {order.itemsCount === 1 ? "producto" : "productos"}
          </div>
          <div className="text-lg font-bold">
            {order.totalAmount.toFixed(2)} {order.currency}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
          Ver Detalle
        </Button>
        {canTakeAction && (
          <>
            <Button variant="destructive" size="sm" onClick={() => onCancel(order)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={() => onPay(order)}>
              Pagar Orden
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}