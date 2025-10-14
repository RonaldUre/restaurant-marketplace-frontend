import { api } from "@/lib/axios";
import { format } from "date-fns";

// --- Helper Function ---

/**
 * Formats a Date object into a 'yyyy-MM-dd' string, safe for API calls.
 * Returns an empty string if the date is null or undefined.
 */
const formatDateForApi = (date: Date | null | undefined): string => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};


// --- Type Definitions for API Payloads and Responses ---

// Common parameters for most reporting requests
export interface ReportDateRangeParams {
  from: Date;
  to: Date;
}

// Corresponds to DailySalesRequest.java
export interface DailySalesParams extends ReportDateRangeParams {
  tenantId?: number; // Required for platform, ignored for admin
}

// Corresponds to TopProductsRequest.java
export interface TopProductsParams extends ReportDateRangeParams {
  limit: number;
  tenantId?: number; // Required for platform, ignored for admin
}

// Corresponds to OrdersStatusRequest.java
export interface OrdersStatusParams extends ReportDateRangeParams {
  tenantId?: number; // Required for platform, ignored for admin
}

// --- Response Types (matching Java DTOs) ---

export interface DailySalesResponse {
  date: string; // "yyyy-MM-dd"
  orders: number;
  totalAmount: number;
  currency: string;
}

export interface TopProductResponse {
  productId: number;
  name: string;
  qty: number;
  revenue: number;
  currency: string;
}

export interface StatusBreakdownResponse {
  status: "CREATED" | "PAID" | "CANCELLED" | string; // Be flexible
  count: number;
}


// --- API Service Functions ---

// === Admin Reporting (/admin/reporting) ===

export const getAdminDailySales = (params: ReportDateRangeParams) => {
  return api.get<DailySalesResponse[]>("/admin/reporting/sales/daily", {
    params: { from: formatDateForApi(params.from), to: formatDateForApi(params.to) },
  });
};

export const getAdminTopProducts = (params: ReportDateRangeParams & { limit: number }) => {
  return api.get<TopProductResponse[]>("/admin/reporting/top-products", {
    params: { from: formatDateForApi(params.from), to: formatDateForApi(params.to), limit: params.limit },
  });
};

export const getAdminOrdersStatus = (params: ReportDateRangeParams) => {
  return api.get<StatusBreakdownResponse[]>("/admin/reporting/orders/status", {
    params: { from: formatDateForApi(params.from), to: formatDateForApi(params.to) },
  });
};

// === Platform Reporting (/platform/reporting) ===

export const getPlatformDailySales = (params: DailySalesParams) => {
  return api.get<DailySalesResponse[]>("/platform/reporting/sales/daily", {
    params: { from: formatDateForApi(params.from), to: formatDateForApi(params.to), tenantId: params.tenantId },
  });
};

export const getPlatformTopProducts = (params: TopProductsParams) => {
  return api.get<TopProductResponse[]>("/platform/reporting/top-products", {
    params: { from: formatDateForApi(params.from), to: formatDateForApi(params.to), limit: params.limit, tenantId: params.tenantId },
  });
};

export const getPlatformOrdersStatus = (params: OrdersStatusParams) => {
  return api.get<StatusBreakdownResponse[]>("/platform/reporting/orders/status", {
    params: { from: formatDateForApi(params.from), to: formatDateForApi(params.to), tenantId: params.tenantId },
  });
};