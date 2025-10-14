"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { toast } from "sonner";
import {
  getPlatformDailySales,
  getPlatformTopProducts,
  getPlatformOrdersStatus,
  type DailySalesResponse,
  type TopProductResponse,
  type StatusBreakdownResponse,
} from "../services/reportingService";

import { RestaurantSelector } from "../components/RestaurantSelector";
import { DateRangePicker } from "../components/DateRangePicker";
import { DailySalesChart } from "../components/DailySalesChart";
import { TopProductsTable } from "../components/TopProductsTable";
import { OrderStatusPieChart } from "../components/OrderStatusPieChart";
import { Separator } from "@/components/ui/separator";

export default function PlatformReportsPage() {
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  // State for each report's data
  const [dailySales, setDailySales] = useState<DailySalesResponse[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductResponse[]>([]);
  const [orderStatus, setOrderStatus] = useState<StatusBreakdownResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // No fetching data if no restaurant is selected
    if (!selectedTenantId || !dateRange?.from || !dateRange?.to) {
      // Clear previous data when restaurant is deselected
      setDailySales([]);
      setTopProducts([]);
      setOrderStatus([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sales, products, statuses] = await Promise.all([
          getPlatformDailySales({ from: dateRange.from!, to: dateRange.to!, tenantId: selectedTenantId }),
          getPlatformTopProducts({ from: dateRange.from!, to: dateRange.to!, limit: 5, tenantId: selectedTenantId }),
          getPlatformOrdersStatus({ from: dateRange.from!, to: dateRange.to!, tenantId: selectedTenantId }),
        ]);

        setDailySales(sales.data);
        setTopProducts(products.data);
        setOrderStatus(statuses.data);
      } catch (error) {
        console.error("Error fetching platform reports data:", error);
        toast.error("No se pudieron cargar los datos de los reportes para este restaurante.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedTenantId]);

  return (
    <div className="space-y-6">
      {/* --- Page Header and Filters --- */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes de Plataforma</h1>
        <p className="text-muted-foreground">
          Selecciona un restaurante y un rango de fechas para analizar su rendimiento.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <RestaurantSelector
          selectedId={selectedTenantId}
          onSelect={setSelectedTenantId}
        />
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      <Separator />

      {/* --- Reports Section --- */}
      {!selectedTenantId ? (
        <div className="flex h-80 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">Por favor, selecciona un restaurante para ver sus reportes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailySalesChart
            data={dailySales}
            isLoading={isLoading}
            dateRange={{ from: dateRange?.from, to: dateRange?.to }}
          />
          <OrderStatusPieChart data={orderStatus} isLoading={isLoading} />
          <div className="lg:col-span-2">
            <TopProductsTable data={topProducts} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
}
