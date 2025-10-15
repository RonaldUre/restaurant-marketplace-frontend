import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  listMyOrders,
  cancelOwnOrder,
  createPayment,
  getOrderDetail,
  type OrderCardResponse,
  type OrderDetailResponse,
} from "../services/orderingService";
import { OrderCard } from "../components/OrderCard";
import { ConfirmCancelModal } from "../components/ConfirmCancelModal";
import { ConfirmPaymentModal } from "../components/ConfirmPaymentModal";
import { DetailModal } from "@/components/shared/DetailModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type OrderStatusFilter = "PENDING" | "PAID" | "CANCELLED";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderCardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter | undefined>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderCardResponse | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailedOrder, setDetailedOrder] = useState<OrderDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

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

  const handleOpenPayModal = (order: OrderCardResponse) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  const handleOpenCancelModal = (order: OrderCardResponse) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      localStorage.setItem("pending_payment_order_id", selectedOrder.id.toString());
      const res = await createPayment(selectedOrder.id, { paymentMethod: "PAYPAL" });
      window.location.href = res.data.approvalUrl;
    } catch (error) {
      localStorage.removeItem("pending_payment_order_id");
      console.error("Error creating payment:", error);
      toast.error("No se pudo iniciar el proceso de pago. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  const handleConfirmCancel = async (reason?: string) => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      await cancelOwnOrder(selectedOrder.id, { reason });
      toast.success(`Orden #${selectedOrder.id} cancelada exitosamente.`);
      setIsCancelModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("No se pudo cancelar la orden. Es posible que ya no sea cancelable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = async (order: OrderCardResponse) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    setDetailedOrder(null);
    try {
      const res = await getOrderDetail(order.id);
      setDetailedOrder(res.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("No se pudieron cargar los detalles de la orden.");
      setIsDetailModalOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Órdenes</h1>
        <p className="text-muted-foreground">Aquí puedes ver el historial de todas tus compras.</p>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(value) => setStatusFilter(value === "all" ? undefined : (value as OrderStatusFilter))}
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
              onPay={handleOpenPayModal}
              onCancel={handleOpenCancelModal}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground">No tienes órdenes con este estado.</p>
        </div>
      )}

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

      <ConfirmPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
        isLoading={isSubmitting}
        order={selectedOrder}
      />
      
      <ConfirmCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isLoading={isSubmitting}
        order={selectedOrder}
      />
      
      {selectedOrder && (
        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Detalle de la Orden #${selectedOrder.id}`}
          loading={isDetailLoading}
          fields={[
            {
              label: "Estado",
              value: detailedOrder ? <Badge>{detailedOrder.status}</Badge> : "",
            },
            {
              label: "Fecha",
              value: new Date(selectedOrder.createdAt).toLocaleString(),
            },
            {
              label: "Total",
              value: `${detailedOrder?.totalAmount.toFixed(2)} ${detailedOrder?.currency}`,
            },
            {
              label: "Productos",
              value: (
                <ul className="list-disc pl-5 text-sm">
                  {detailedOrder?.lines.map((line) => (
                    <li key={line.productId}>
                      {line.qty} x {line.name} (@ {line.unitPriceAmount.toFixed(2)} c/u)
                    </li>
                  ))}
                </ul>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}