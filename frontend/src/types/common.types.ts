// Respuesta genérica de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Respuesta paginada (coincide con backend PaginatedResponseDto)
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Parámetros de paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Opciones para selects
export interface SelectOption {
  value: string;
  label: string;
}

// Error de la API
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
