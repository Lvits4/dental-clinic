import { API_BASE_URL } from '../constants/api';
import type { ApiError } from '../types/common';

class HttpError extends Error {
  statusCode: number;
  details?: string | string[];

  constructor(statusCode: number, message: string, details?: string | string[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'HttpError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiError | null = null;
    try {
      errorData = await response.json();
    } catch {
      // No JSON body
    }

    // Si es 401, limpiar token y redirigir al login
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.hash = '#/login';
    }

    throw new HttpError(
      response.status,
      errorData?.error || response.statusText || 'Error desconocido',
      errorData?.message,
    );
  }

  // Si la respuesta es 204 (No Content), retornar vacío
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

function getHeaders(isFormData = false): HeadersInit {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchDefault<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(isFormData),
      ...options.headers,
    },
  });

  return handleResponse<T>(response);
}

// Métodos de conveniencia
export const http = {
  get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return fetchDefault<T>(url, { method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return fetchDefault<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return fetchDefault<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return fetchDefault<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return fetchDefault<T>(endpoint, { method: 'DELETE' });
  },
};

export { HttpError };
