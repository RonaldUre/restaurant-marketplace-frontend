import { publicApi } from "@/lib/axios";
import type { PaginatedResponse } from "@/types/pagination";

// --- Restaurant Types ---

export interface RestaurantCard {
  id: number;
  name: string;
  slug: string;
  status: "OPEN" | "CLOSED" | "SUSPENDED";
  city: string;
}

export interface AddressResponse {
  line1: string;
  line2: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface RestaurantPublicDetail {
  id: number;
  name: string;
  slug: string;
  status: "OPEN" | "CLOSED" | "SUSPENDED";
  email: string;
  phone: string;
  address: AddressResponse;
  openingHoursJson: string;
}

export interface ListRestaurantsPublicParams {
  page?: number;
  size?: number;
  city?: string;
}

// --- Product Types ---

export interface PublicProductCard {
  id: number;
  name: string;
  category: string;
  priceAmount: number;
  priceCurrency: string;
  available: boolean;
}

export interface PublicProductDetail {
  id: number;
  name: string;
  description: string;
  category: string;
  priceAmount: number;
  priceCurrency: string;
  available: boolean;
}

export interface ListProductsPublicParams {
  page?: number;
  size?: number;
  q?: string;
  category?: string;
  sortBy?: "name" | "priceAmount";
  sortDir?: "asc" | "desc";
}


// --- API Functions ---

/**
 * Lists all public restaurants (paginated).
 * GET /restaurants
 */
export const listPublicRestaurants = (params: ListRestaurantsPublicParams) => {
  return publicApi.get<PaginatedResponse<RestaurantCard>>("/restaurants", {
    params,
  });
};

/**
 * Gets the detailed public profile of a single restaurant by its slug.
 * GET /restaurants/slug/{slug}
 */
export const getPublicRestaurantBySlug = (slug: string) => {
  return publicApi.get<RestaurantPublicDetail>(`/restaurants/slug/${slug}`);
};

/**
 * Lists all published products for a specific restaurant (paginated).
 * GET /public/restaurants/{restaurantId}/products
 */
export const listPublicProducts = (
  restaurantId: number,
  params: ListProductsPublicParams
) => {
  return publicApi.get<PaginatedResponse<PublicProductCard>>(
    `/public/restaurants/${restaurantId}/products`,
    { params }
  );
};

/**
 * Gets the detailed public view of a single product.
 * GET /public/restaurants/{restaurantId}/products/{productId}
 */
export const getPublicProductDetail = (
  restaurantId: number,
  productId: number
) => {
  return publicApi.get<PublicProductDetail>(
    `/public/restaurants/${restaurantId}/products/${productId}`
  );
};
