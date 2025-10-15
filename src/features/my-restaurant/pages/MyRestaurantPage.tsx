// src/features/my-restaurant/pages/MyRestaurantPage.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStatusTab } from "../components/ProfileStatusTab";
import { ProductCatalogTab } from "../components/ProductCatalogTab";
import { InventoryManagementTab } from "../components/InventoryManagementTab";
import { ReportsTab } from "../components/ReportsTab"; // 👈 1. Importa la nueva pestaña
import { OrderManagementTab } from "../components/OrderManagementTab";

export default function MyRestaurantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Mi Restaurante
        </h1>
        <p className="text-muted-foreground">
          Administra el perfil, catálogo, inventario y reportes de tu
          restaurante.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil y Estado</TabsTrigger>
          <TabsTrigger value="catalog">Catálogo</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Contenido de la Pestaña 1: Perfil y Estado */}
        <TabsContent value="profile">
          <ProfileStatusTab />
        </TabsContent>

        {/* Contenido de la Pestaña 2: Catálogo de Productos */}
        <TabsContent value="catalog">
          <ProductCatalogTab />
        </TabsContent>

        {/* Contenido de la Pestaña 3: Gestión de Inventario */}
        <TabsContent value="inventory">
          <InventoryManagementTab />
        </TabsContent>

        {/* 👇 3. Añade el contenido de la nueva pestaña 👇 */}
        <TabsContent value="reports">
          <ReportsTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
