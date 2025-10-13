import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CrudTable } from "@/components/shared/CrudTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ProductAdminCard } from "../services/productAdminService";

interface Props {
  products: ProductAdminCard[];
  isLoading: boolean;
  onTogglePublish: (product: ProductAdminCard) => void;
}

export function ProductTable({ products, isLoading, onTogglePublish }: Props) {
  const navigate = useNavigate();

  const columns = [
    {
      header: "SKU",
      render: (p: ProductAdminCard) => <span className="font-mono text-xs">{p.sku}</span>,
    },
    {
      header: "Nombre",
      render: (p: ProductAdminCard) => p.name,
    },
    {
      header: "Categoría",
      render: (p: ProductAdminCard) => p.category,
    },
    {
      header: "Precio",
      render: (p: ProductAdminCard) =>
        `${p.priceAmount.toFixed(2)} ${p.priceCurrency}`,
    },
    {
      header: "Publicado",
      render: (p: ProductAdminCard) => (
        <Badge variant={p.published ? "success" : "secondary"}>
          {p.published ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
        header: "Creado",
        render: (p: ProductAdminCard) => format(new Date(p.createdAt), "P", { locale: es }),
    },
    {
      header: "Acciones",
      render: (p: ProductAdminCard) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/my-restaurant/products/${p.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant={p.published ? "destructive" : "default"}
            size="sm"
            onClick={() => onTogglePublish(p)}
          >
            {p.published ? "Despublicar" : "Publicar"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <CrudTable<ProductAdminCard>
      data={products}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="Aún no has creado ningún producto."
    />
  );
}
