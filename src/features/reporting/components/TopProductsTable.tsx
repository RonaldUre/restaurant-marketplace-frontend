import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type TopProductResponse } from "../services/reportingService";

interface Props {
  data: TopProductResponse[];
  isLoading: boolean;
}

export function TopProductsTable({ data, isLoading }: Props) {
   if (isLoading) {
    return <Card className="h-80 w-full animate-pulse bg-muted" />;
  }
  
  if (data.length === 0) {
    return (
       <Card className="flex h-80 w-full items-center justify-center">
        <p className="text-muted-foreground">No hay productos vendidos en este período.</p>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Productos</CardTitle>
         <CardDescription>Productos más vendidos por ingresos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Ingresos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product) => (
              <TableRow key={product.productId}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.qty}</TableCell>
                <TableCell className="text-right">{product.revenue.toFixed(2)} {product.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
