import { useState, type FormEvent } from 'react';
import { Input, Select, Textarea, Button, FormSection, FormActionBar } from '../ui';
import type { CreateTreatmentDto, TreatmentFormErrors, Treatment } from '../../types';
import { TREATMENT_CATEGORIES } from '../../types';
import { treatmentEditUnchanged } from '../../utils/editUnchangedCompare';

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
  onUnchanged?: () => void;
  loading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  fillParent?: boolean;
}

/* ── Icono de sección ── */
const IconTreatment = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const TreatmentForm = ({
  initialData,
  onSubmit,
  onUnchanged,
  loading = false,
  submitLabel = 'Guardar',
  onCancel,
  fillParent = false,
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

    if (initialData && treatmentEditUnchanged(initialData, data)) {
      onUnchanged?.();
      return;
    }

    onSubmit(data);
  };

  const iconClose = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const fields = (
    <FormSection title="Información del Tratamiento" icon={<IconTreatment />} description="Nombre, categoría y precio">
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
      <div className="mt-4">
        <Textarea
          label="Descripción"
          placeholder="Descripción del tratamiento..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
    </FormSection>
  );

  const actions = onCancel ? (
    <FormActionBar
      left={<Button type="button" variant="secondary" size="md" leftIcon={iconClose} onClick={onCancel} disabled={loading}>Cancelar</Button>}
      right={<Button type="submit" size="md" loading={loading}>{submitLabel}</Button>}
    />
  ) : (
    <FormActionBar end={<Button type="submit" size="md" loading={loading}>{submitLabel}</Button>} />
  );

  if (fillParent) {
    return (
      <form onSubmit={handleSubmit} className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">{fields}</div>
        {actions}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields}
      {actions}
    </form>
  );
};

export default TreatmentForm;
