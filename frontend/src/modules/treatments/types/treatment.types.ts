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
