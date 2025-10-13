import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getInventoryAdmin,
  adjustStock,
  switchToLimited,
  switchToUnlimited,
  type InventoryAdminItem,
} from "../services/inventoryAdminService";
import { InventoryTable } from "./InventoryTable";
import { AdjustStockModal } from "./AdjustStockModal";
import { SwitchToLimitedModal } from "./SwitchToLimitedModal";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
// 👇 CAMBIO: Importamos las piezas del componente de paginación
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function InventoryManagementTab() {
  // --- STATE MANAGEMENT ---
  const [inventory, setInventory] = useState<InventoryAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for modals
  const [itemToAdjust, setItemToAdjust] = useState<InventoryAdminItem | null>(null);
  const [itemToSwitchLimited, setItemToSwitchLimited] = useState<InventoryAdminItem | null>(null);
  const [itemToSwitchUnlimited, setItemToSwitchUnlimited] = useState<InventoryAdminItem | null>(null);

  // --- DATA FETCHING ---
  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getInventoryAdmin({ page: page - 1, size: 10 });
      setInventory(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("No se pudo cargar el inventario.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // --- HANDLERS ---
  const handleAdjustSubmit = async (values: { delta: number; reason?: string }) => {
    if (!itemToAdjust) return;
    try {
      await adjustStock(itemToAdjust.productId, values);
      toast.success(`Stock de "${itemToAdjust.name}" ajustado correctamente.`);
      setItemToAdjust(null);
      fetchInventory();
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast.error("No se pudo ajustar el stock.");
    }
  };

  const handleSwitchToLimitedSubmit = async (values: { initialAvailable: number }) => {
    if (!itemToSwitchLimited) return;
    try {
      await switchToLimited(itemToSwitchLimited.productId, values);
      toast.success(`"${itemToSwitchLimited.name}" ahora tiene stock limitado.`);
      setItemToSwitchLimited(null);
      fetchInventory();
    } catch (error) {
      console.error("Error switching to limited stock:", error);
      toast.error("No se pudo cambiar el tipo de stock.");
    }
  };

  const handleSwitchToUnlimitedConfirm = async () => {
    if (!itemToSwitchUnlimited) return;
    try {
      await switchToUnlimited(itemToSwitchUnlimited.productId);
      toast.success(`"${itemToSwitchUnlimited.name}" ahora tiene stock ilimitado.`);
      setItemToSwitchUnlimited(null);
      fetchInventory();
    } catch (error) {
      console.error("Error switching to unlimited stock:", error);
      toast.error("No se pudo cambiar el tipo de stock.");
    }
  };
  
  return (
    <div className="space-y-6">
      <InventoryTable
        items={inventory}
        isLoading={isLoading}
        onAdjustStock={setItemToAdjust}
        onSwitchToLimited={setItemToSwitchLimited}
        onSwitchToUnlimited={setItemToSwitchUnlimited}
      />

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

      {/* --- MODALS --- */}
      <AdjustStockModal
        isOpen={!!itemToAdjust}
        onClose={() => setItemToAdjust(null)}
        item={itemToAdjust}
        onSubmit={handleAdjustSubmit}
      />

      <SwitchToLimitedModal
        isOpen={!!itemToSwitchLimited}
        onClose={() => setItemToSwitchLimited(null)}
        item={itemToSwitchLimited}
        onSubmit={handleSwitchToLimitedSubmit}
      />

      <ConfirmDeleteModal
        isOpen={!!itemToSwitchUnlimited}
        onCancel={() => setItemToSwitchUnlimited(null)}
        onConfirm={handleSwitchToUnlimitedConfirm}
        title="Confirmar Cambio a Stock Ilimitado"
        description={`¿Estás seguro de que deseas cambiar "${itemToSwitchUnlimited?.name}" a stock ilimitado? Esta acción solo es posible si no hay stock reservado.`}
        confirmLabel="Sí, cambiar"
        variant="default"
      />
    </div>
  );
}

