import { api } from "@/lib/axios";
import type { PaginatedResponse } from "@/types/pagination";

// --- Type Definitions for API Payloads and Responses ---

// Matches PlaceOrderRequest.java
export interface PlaceOrderPayload {
  restaurantId: number;
  items: {
    productId: number;
    qty: number;
  }[];
}

// Matches CreatePaymentRequestDto.java
export interface CreatePaymentPayload {
  paymentMethod: string; // e.g., "PAYPAL"
}

// Matches CapturePaymentRequestDto.java
export interface CapturePaymentPayload {
  paymentProviderOrderId: string; // The token from PayPal
}

// Matches CancelOrderRequest.java
export interface CancelOrderPayload {
  reason?: string;
}

// Matches ListOrdersPublicRequest.java
export interface ListMyOrdersParams {
  status?: "PENDING" | "PAID" | "CANCELLED";
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

// Matches OrderDetailResponse.java
export interface OrderDetailResponse {
  id: number;
  tenantId: number;
  customerId: number;
  status: "CREATED" | "PAID" | "CANCELLED" | string;
  totalAmount: number;
  currency: string;
  createdAt: string; // ISO date string
  lines: {
    productId: number;
    name: string;
    unitPriceAmount: number;
    currency: string;
    qty: number;
    lineTotalAmount: number;
  }[];
}

// Matches OrderCardResponse.java
export interface OrderCardResponse {
  id: number;
  status: "CREATED" | "PAID" | "CANCELLED" | string;
  totalAmount: number;
  currency: string;
  itemsCount: number;
  createdAt: string; // ISO date string
}

// Matches CreatePaymentResponseDto.java
export interface CreatePaymentResponse {
  approvalUrl: string;
}


// --- API Service Functions ---

/**
 * Places a new order.
 * POST /orders
 */
export const placeOrder = (payload: PlaceOrderPayload) => {
  return api.post<OrderDetailResponse>("/orders", payload);
};

/**
 * Creates a payment intent with the payment provider (e.g., PayPal).
 * POST /orders/{id}/payment/create
 */
export const createPayment = (orderId: number, payload: CreatePaymentPayload) => {
  return api.post<CreatePaymentResponse>(`/orders/${orderId}/payment/create`, payload);
};

/**
 * Captures the payment after the user approves it on the provider's site.
 * POST /orders/{id}/payment/capture
 */
export const capturePayment = (orderId: number, payload: CapturePaymentPayload, idempotencyKey?: string) => {
  return api.post<OrderDetailResponse>(`/orders/${orderId}/payment/capture`, payload, {
    headers: {
        ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey })
    }
  });
};

/**
 * Lists the current user's orders (paginated).
 * GET /orders
 */
export const listMyOrders = (params: ListMyOrdersParams) => {
  return api.get<PaginatedResponse<OrderCardResponse>>("/orders", { params });
};

/**
 * Allows a customer to cancel their own order (if in a cancellable state).
 * POST /orders/{id}/cancel
 */
export const cancelOwnOrder = (orderId: number, payload?: CancelOrderPayload) => {
  return api.post<OrderDetailResponse>(`/orders/${orderId}/cancel`, payload);
};

/**
 * Obtiene la vista detallada de una sola orden del usuario actual.
 * GET /orders/{id}
 */
export const getOrderDetail = (orderId: number) => {
  return api.get<OrderDetailResponse>(`/orders/${orderId}`);
};
