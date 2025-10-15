import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { listMyOrders, type OrderCardResponse } from "../services/orderingService";
import { OrderCard } from "../components/OrderCard";
// 👇 CAMBIO: Importamos las piezas del componente de paginación
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderCardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listMyOrders({
        page: page - 1,
        size: 5,
        status: statusFilter,
      });
      setOrders(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching my orders:", error);
      toast.error("No se pudieron cargar tus órdenes.");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Órdenes</h1>
        <p className="text-muted-foreground">Aquí puedes ver el historial de todas tus compras.</p>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(value) => setStatusFilter(value === "all" ? undefined : (value as OrderStatus))}
      >
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="PENDING">Pendientes</TabsTrigger>
          <TabsTrigger value="PAID">Pagadas</TabsTrigger>
          <TabsTrigger value="CANCELLED">Canceladas</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPay={(o) => alert(`Pagar orden #${o.id}`)} // Placeholder
              onCancel={(o) => alert(`Cancelar orden #${o.id}`)} // Placeholder
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground">No tienes órdenes con este estado.</p>
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