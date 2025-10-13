import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  listProductsAdmin,
  publishProduct,
  unpublishProduct,
  type ProductAdminCard,
} from "../services/productAdminService";
import { type PaginatedResponse } from "@/types/pagination";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { ProductTable } from "./ProductTable";

export function ProductCatalogTab() {
  const [response, setResponse] = useState<PaginatedResponse<
    ProductAdminCard
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [productToAction, setProductToAction] = useState<ProductAdminCard | null>(
    null
  );

  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await listProductsAdmin({ page: page - 1, size: 10 });
      setResponse(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("No se pudieron cargar los productos del catálogo.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleConfirmTogglePublish = async () => {
    if (!productToAction) return;

    const isPublishing = !productToAction.published;
    const action = isPublishing ? publishProduct : unpublishProduct;
    const successMessage = isPublishing
      ? "Producto publicado."
      : "Producto despublicado.";

    try {
      await action(productToAction.id);
      toast.success(successMessage);
      fetchProducts(); // Recargar la lista
    } catch (error) {
      console.error("Error al completar la acción:", error);
      toast.error("No se pudo completar la acción.");
    } finally {
      setProductToAction(null); // Cerrar el modal
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Catálogo de Productos
          </h2>
          <p className="text-muted-foreground">
            Gestiona los productos de tu restaurante.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/my-restaurant/products/new")}>
          + Añadir Producto
        </Button>
      </div>

      <ProductTable
        products={response?.items ?? []}
        isLoading={isLoading}
        onTogglePublish={setProductToAction}
      />

      {response && response.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(1, prev - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="p-2 text-sm">
                Página {page} de {response.totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(response.totalPages, prev + 1));
                }}
                className={
                  page === response.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modal de confirmación para publicar/despublicar */}
      <ConfirmDeleteModal
        isOpen={!!productToAction}
        onCancel={() => setProductToAction(null)}
        onConfirm={handleConfirmTogglePublish}
        title={
          productToAction?.published
            ? "¿Despublicar Producto?"
            : "¿Publicar Producto?"
        }
        description={`¿Estás seguro de que deseas ${
          productToAction?.published ? "despublicar" : "publicar"
        } el producto:`}
        entityName={productToAction?.name}
        confirmLabel={
          productToAction?.published ? "Sí, despublicar" : "Sí, publicar"
        }
        variant={productToAction?.published ? "destructive" : "default"}
      />
    </div>
  );
}
