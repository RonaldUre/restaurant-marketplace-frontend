// src/features/my-restaurant/pages/MyRestaurantPage.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStatusTab } from "../components/ProfileStatusTab";
import { ProductCatalogTab } from "../components/ProductCatalogTab";
import { InventoryManagementTab } from "../components/InventoryManagementTab";

export default function MyRestaurantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Mi Restaurante
        </h1>
        <p className="text-muted-foreground">
          Administra el perfil, catálogo de productos e inventario de tu
          restaurante.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil y Estado</TabsTrigger>
          <TabsTrigger value="catalog">Catálogo de Productos</TabsTrigger>
          <TabsTrigger value="inventory">Gestión de Inventario</TabsTrigger>
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
      </Tabs>
    </div>
  );
}