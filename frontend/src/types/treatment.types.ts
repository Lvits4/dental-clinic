export interface Treatment {
  id: string;
  name: string;
  description?: string;
  category: string;
  defaultPrice: number;
  isActive: boolean;
}

export interface CreateTreatmentDto {
  name: string;
  description?: string;
  category: string;
  defaultPrice?: number;
}

export type UpdateTreatmentDto = Partial<CreateTreatmentDto>;

export interface TreatmentFormErrors {
  name?: string;
  category?: string;
  defaultPrice?: string;
}

export type TreatmentSortBy = 'name' | 'category' | 'defaultPrice' | 'createdAt';

export type TreatmentSortOrder = 'asc' | 'desc';

export interface TreatmentFilters {
  page?: number;
  limit?: number;
  /** Búsqueda por nombre (coincide con query `name` del backend) */
  name?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: TreatmentSortBy;
  sortOrder?: TreatmentSortOrder;
}

export const TREATMENT_CATEGORIES = [
  { value: 'general', label: 'Odontología General' },
  { value: 'ortodoncia', label: 'Ortodoncia' },
  { value: 'endodoncia', label: 'Endodoncia' },
  { value: 'periodoncia', label: 'Periodoncia' },
  { value: 'cirugia', label: 'Cirugía Oral' },
  { value: 'estetica', label: 'Estética Dental' },
  { value: 'protesis', label: 'Prótesis' },
  { value: 'radiologia', label: 'Radiología' },
  { value: 'otro', label: 'Otro' },
];
