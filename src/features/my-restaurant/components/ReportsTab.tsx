import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { toast } from "sonner";

import { DateRangePicker } from "@/features/reporting/components/DateRangePicker";
import { getAdminDailySales, getAdminTopProducts, getAdminOrdersStatus } from "@/features/reporting/services/reportingService";

import { DailySalesChart } from "@/features/reporting/components/DailySalesChart";
import { TopProductsTable } from "@/features/reporting/components/TopProductsTable";
import { OrderStatusPieChart } from "@/features/reporting/components/OrderStatusPieChart";

import { type DailySalesResponse, type TopProductResponse, type StatusBreakdownResponse } from "@/features/reporting/services/reportingService";

export function ReportsTab() {
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
    if (!dateRange?.from || !dateRange?.to) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sales, products, statuses] = await Promise.all([
          getAdminDailySales({ from: dateRange.from!, to: dateRange.to! }),
          getAdminTopProducts({ from: dateRange.from!, to: dateRange.to!, limit: 5 }),
          getAdminOrdersStatus({ from: dateRange.from!, to: dateRange.to! }),
        ]);

        setDailySales(sales.data);
        setTopProducts(products.data);
        setOrderStatus(statuses.data);
      } catch (error) {
        console.error("Error fetching reports data:", error);
        toast.error("No se pudieron cargar los datos de los reportes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold">Reportes de Rendimiento</h2>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 👇 CAMBIO: Pasamos el dateRange al componente del gráfico 👇 */}
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
    </div>
  );
}
