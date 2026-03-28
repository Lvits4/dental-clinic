import type { CreateTreatmentDto, TreatmentFormErrors } from '../types/treatment.types';

export function validateTreatment(data: CreateTreatmentDto): TreatmentFormErrors {
  const errors: TreatmentFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'El nombre es obligatorio';
  }

  if (!data.category.trim()) {
    errors.category = 'La categoría es obligatoria';
  }

  if (data.defaultPrice !== undefined && data.defaultPrice < 0) {
    errors.defaultPrice = 'El precio no puede ser negativo';
  }

  return errors;
}
