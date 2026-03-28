import { useState, useCallback } from 'react';
import type { PaginationParams } from '../types/common';

interface UsePaginationReturn extends PaginationParams {
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setLimit: (limit: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  reset: () => void;
}

export function usePagination(defaults?: Partial<PaginationParams>): UsePaginationReturn {
  const [page, setPage] = useState(defaults?.page || 1);
  const [limit, setLimit] = useState(defaults?.limit || 10);
  const [search, setSearchValue] = useState(defaults?.search || '');
  const [sortBy, setSortBy] = useState(defaults?.sortBy || '');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(defaults?.sortOrder || 'ASC');

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1); // Reset a primera página al buscar
  }, []);

  const reset = useCallback(() => {
    setPage(defaults?.page || 1);
    setLimit(defaults?.limit || 10);
    setSearchValue(defaults?.search || '');
    setSortBy(defaults?.sortBy || '');
    setSortOrder(defaults?.sortOrder || 'ASC');
  }, [defaults]);

  return {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    setPage,
    setSearch,
    setLimit,
    setSortBy,
    setSortOrder,
    reset,
  };
}
