import { useState, type FormEvent } from 'react';
import { Input, Select, Textarea, Button } from '../ui';
import type { CreateTreatmentDto, TreatmentFormErrors, Treatment } from '../../types';
import { TREATMENT_CATEGORIES } from '../../types';

function validateTreatment(data: CreateTreatmentDto): TreatmentFormErrors {
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

interface TreatmentFormProps {
  initialData?: Treatment;
  onSubmit: (data: CreateTreatmentDto) => void;
  loading?: boolean;
  submitLabel?: string;
}

const TreatmentForm = ({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
}: TreatmentFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [defaultPrice, setDefaultPrice] = useState(initialData?.defaultPrice?.toString() || '');
  const [errors, setErrors] = useState<TreatmentFormErrors>({});

  const clearError = (field: keyof TreatmentFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data: CreateTreatmentDto = {
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim(),
      defaultPrice: defaultPrice ? Number(defaultPrice) : undefined,
    };

    const validationErrors = validateTreatment(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre *"
          placeholder="Limpieza dental"
          value={name}
          onChange={(e) => { setName(e.target.value); clearError('name'); }}
          error={errors.name}
          autoFocus
        />
        <Select
          label="Categoría *"
          options={TREATMENT_CATEGORIES}
          value={category}
          onChange={(e) => { setCategory(e.target.value); clearError('category'); }}
          error={errors.category}
        />
        <Input
          label="Precio por defecto"
          type="number"
          placeholder="0.00"
          value={defaultPrice}
          onChange={(e) => { setDefaultPrice(e.target.value); clearError('defaultPrice'); }}
          error={errors.defaultPrice}
          min="0"
          step="0.01"
        />
      </div>
      <Textarea
        label="Descripción"
        placeholder="Descripción del tratamiento..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default TreatmentForm;
