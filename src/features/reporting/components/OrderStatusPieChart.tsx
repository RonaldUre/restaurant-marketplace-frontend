/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type StatusBreakdownResponse } from "../services/reportingService";

interface Props {
  data: StatusBreakdownResponse[];
  isLoading: boolean;
}

const statusMap = {
  PAID: { name: 'Pagadas', color: '#16a34a' },
  CANCELLED: { name: 'Canceladas', color: '#dc2626' },
  CREATED: { name: 'Creadas', color: '#64748b' },
};

// --- 👇 ESTA ES LA SOLUCIÓN DEFINITIVA 👇 ---
// Función de renderizado personalizada para la etiqueta del gráfico de pastel.
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent}: any) => {
  const RADIAN = Math.PI / 180;
  // Calculamos la posición de la etiqueta en el exterior del gráfico
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Solo mostramos la etiqueta si el porcentaje es suficientemente grande
  if (!percent || percent < 0.05) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function OrderStatusPieChart({ data, isLoading }: Props) {
  if (isLoading) {
    return <Card className="h-80 w-full animate-pulse bg-muted" />;
  }

  if (data.length === 0) {
    return (
       <Card className="flex h-80 w-full items-center justify-center">
        <p className="text-muted-foreground">No hay órdenes en este período.</p>
      </Card>
    )
  }

  const chartData = data.map(item => ({
    name: statusMap[item.status as keyof typeof statusMap]?.name || item.status,
    value: item.count,
    color: statusMap[item.status as keyof typeof statusMap]?.color || '#a1a1aa'
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Órdenes</CardTitle>
        <CardDescription>Estados de las órdenes en el período seleccionado.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              // Usamos nuestra función de renderizado personalizada
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))' }}/>
            <Legend wrapperStyle={{ fontSize: '0.875rem' }}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}