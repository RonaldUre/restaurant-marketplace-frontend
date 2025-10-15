/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  listAdminOrders,
  getAdminOrderDetail,
  cancelAdminOrder,
  confirmAdminPayment,
  type ListOrdersAdminParams,
} from "../services/orderAdminService";
import type { OrderCardResponse, OrderDetailResponse } from "@/features/marketplace/services/orderingService";
import { AdminOrderTable } from "./AdminOrderTable";
import { DetailModal } from "@/components/shared/DetailModal";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type OrderStatusFilter = "PENDING" | "PAID" | "CANCELLED";

export function OrderManagementTab() {
  const [orders, setOrders] = useState<OrderCardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter | undefined>();

  // State for modals
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderCardResponse | null>(null);
  const [detailedOrder, setDetailedOrder] = useState<OrderDetailResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmPaymentModalOpen, setIsConfirmPaymentModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: ListOrdersAdminParams = { page: page - 1, size: 10, status: statusFilter };
      const res = await listAdminOrders(params);
      setOrders(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("No se pudieron cargar las órdenes.");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders() }, [fetchOrders]);
  useEffect(() => { setPage(1) }, [statusFilter]);

  // Handlers for actions
  const handleViewDetails = async (order: OrderCardResponse) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    setDetailedOrder(null); // Limpiar detalles previos mientras carga
    try {
      const res = await getAdminOrderDetail(order.id);
      setDetailedOrder(res.data);
    } catch (error) {
      toast.error("No se pudieron cargar los detalles.");
      setIsDetailModalOpen(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      await cancelAdminOrder(selectedOrder.id);
      toast.success("Orden cancelada exitosamente.");
      fetchOrders();
    } catch (error) {
      toast.error("No se pudo cancelar la orden.");
    } finally {
      setIsSubmitting(false);
      setIsCancelModalOpen(false);
    }
  };
  
  const handleConfirmPayment = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      await confirmAdminPayment(selectedOrder.id);
      toast.success("Pago confirmado manualmente.");
      fetchOrders();
    } catch (error) {
      toast.error("No se pudo confirmar el pago.");
    } finally {
      setIsSubmitting(false);
      setIsConfirmPaymentModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold tracking-tight">Gestión de Órdenes</h2>
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v as OrderStatusFilter)}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="PENDING">Pendientes</TabsTrigger>
          <TabsTrigger value="PAID">Pagadas</TabsTrigger>
          <TabsTrigger value="CANCELLED">Canceladas</TabsTrigger>
        </TabsList>
      </Tabs>

      <AdminOrderTable
        orders={orders}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onCancel={(order) => { setSelectedOrder(order); setIsCancelModalOpen(true); }}
        onConfirmPayment={(order) => { setSelectedOrder(order); setIsConfirmPaymentModalOpen(true); }}
      />

      {/* ✅ INICIA SECCIÓN DE PAGINACIÓN IMPLEMENTADA */}
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
      {/* ⏹️ FIN DE SECCIÓN DE PAGINACIÓN */}

      {/* Modals */}
      {selectedOrder && <DetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Detalle Orden #${selectedOrder.id}`} loading={!detailedOrder} fields={detailedOrder ? [{ label: "Estado", value: <Badge>{detailedOrder.status}</Badge> }, { label: "Fecha", value: new Date(detailedOrder.createdAt).toLocaleString(), }, { label: "Total", value: `${detailedOrder.totalAmount.toFixed(2)} ${detailedOrder.currency}`, }, { label: "Productos", value: (<ul className="list-disc pl-5 text-sm">{detailedOrder.lines.map(l => <li key={l.productId}>{l.qty} x {l.name}</li>)}</ul>) }] : []} />}
      <ConfirmDeleteModal isOpen={isCancelModalOpen} onCancel={() => setIsCancelModalOpen(false)} onConfirm={handleCancel} title="¿Cancelar Orden?" description={`¿Seguro que deseas cancelar la orden #${selectedOrder?.id}?`} confirmLabel="Sí, Cancelar" disabled={isSubmitting} />
      <ConfirmDeleteModal isOpen={isConfirmPaymentModalOpen} onCancel={() => setIsConfirmPaymentModalOpen(false)} onConfirm={handleConfirmPayment} title="¿Confirmar Pago?" description={`¿Seguro que deseas confirmar el pago de la orden #${selectedOrder?.id} manualmente?`} confirmLabel="Sí, Confirmar" variant="default" disabled={isSubmitting} />
    </div>
  );
}