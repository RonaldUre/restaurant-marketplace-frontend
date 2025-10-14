"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { type DailySalesResponse } from "../services/reportingService";

interface Props {
  data: DailySalesResponse[];
  isLoading: boolean;
  dateRange: { from: Date | undefined; to: Date | undefined };
}

// --- Helper para rellenar datos ---
const fillMissingDays = (
  data: DailySalesResponse[],
  range: { from: Date | undefined; to: Date | undefined }
) => {
  if (!range.from || !range.to) {
    return data;
  }

  // Si no hay datos, creamos un array de ceros para el rango
  if (data.length === 0) {
     const allDays = eachDayOfInterval({ start: range.from, end: range.to });
     return allDays.map(day => ({
      date: format(day, "yyyy-MM-dd"),
      totalAmount: 0,
      orders: 0,
      currency: "USD",
     }));
  }

  const salesByDate = new Map(data.map(item => [item.date, item]));
  const allDays = eachDayOfInterval({ start: range.from, end: range.to });

  return allDays.map(day => {
    const dateString = format(day, "yyyy-MM-dd");
    if (salesByDate.has(dateString)) {
      return salesByDate.get(dateString)!;
    }
    return {
      date: dateString,
      totalAmount: 0,
      orders: 0,
      currency: data[0]?.currency || "USD",
    };
  });
};

// --- 👇 CAMBIO: Definimos explícitamente las props para el Tooltip ---
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DailySalesResponse; // El objeto de datos original
  }>;
  label?: string; // La etiqueta del eje X (la fecha)
}

// --- Componente de Tooltip Personalizado ---
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Ventas ({data.currency})
            </span>
            <span className="font-bold text-primary">
              {data.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Órdenes
            </span>
            <span className="font-bold">{data.orders}</span>
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {format(parseISO(label), "eeee, d 'de' MMMM", { locale: es })}
        </div>
      </div>
    );
  }
  return null;
};

// --- Componente Principal del Gráfico ---
export function DailySalesChart({ data, isLoading, dateRange }: Props) {
  const processedData = fillMissingDays(data, dateRange);

  if (isLoading) {
    return <Card className="h-96 w-full animate-pulse bg-muted" />;
  }
  
  if (processedData.length === 0) {
    return (
       <Card className="flex h-96 w-full items-center justify-center">
        <p className="text-muted-foreground">No hay datos de ventas para este período.</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Diarias</CardTitle>
        <CardDescription>Evolución de los ingresos en el período seleccionado.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                stroke="#888888"
                fontSize={12}
                tickFormatter={(date) => format(parseISO(date), "d MMM")} 
              />
              <YAxis 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="totalAmount" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}