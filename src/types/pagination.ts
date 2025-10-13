// src/types/pagination.ts

// 👇 ESTRUCTURA ACTUALIZADA PARA COINCIDIR CON EL BACKEND
export interface PaginatedResponse<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
}
