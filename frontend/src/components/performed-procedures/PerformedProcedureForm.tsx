import { useState, useCallback, useMemo, type FormEventHandler } from 'react';
import { Input, Select, Textarea, Spinner, DatePicker, FormSection, MultiStepForm } from '../ui';
import type { Step } from '../ui';
import type { CreatePerformedProcedureDto, Patient, Doctor, Treatment, PerformedProcedure } from '../../types';
import { PLAN_STATUS_CONFIG } from '../../types';
import { TreatmentPlanStatus } from '../../enums';
import { performedProcedureEditUnchanged } from '../../utils/editUnchangedCompare';
import { getPlanSelectLabel } from '../../utils/treatmentPlans';
import { useTreatmentPlansByPatient } from '../../querys/treatment-plans/queryTreatmentPlans';

interface ProcedureFormErrors {
  patientId?: string;
  doctorId?: string;
  treatmentId?: string;
  planLink?: string;
}

interface PerformedProcedureFormProps {
  patients: Patient[];
  doctors: Doctor[];
  treatments: Treatment[];
  loading?: boolean;
  mode?: 'create' | 'edit';
  /** En modo edición, valores iniciales (id usado para sincronizar estado) */
  initialProcedure?: PerformedProcedure;
  onSubmit: (data: CreatePerformedProcedureDto) => void;
  onUnchanged?: () => void;
  onCancel?: () => void;
}

function initialPlanLink(proc?: PerformedProcedure): { planId: string; itemId: string } {
  if (!proc) return { planId: '', itemId: '' };
  if (proc.treatmentPlanItemId) {
    return {
      planId: proc.treatmentPlanItem?.treatmentPlanId ?? '',
      itemId: proc.treatmentPlanItemId,
    };
  }
  if (proc.treatmentPlanId) {
    return { planId: proc.treatmentPlanId, itemId: '' };
  }
  return { planId: '', itemId: '' };
}

/** En edición conserva la hora del registro; solo cambia el día del calendario. */
function buildPerformedAtIso(
  mode: 'create' | 'edit',
  dateInput: string,
  original?: string | Date,
): string {
  if (mode === 'edit' && original != null) {
    const origStr =
      typeof original === 'string' ? original : new Date(original).toISOString();
    const tIdx = origStr.indexOf('T');
    if (tIdx !== -1) {
      return `${dateInput}${origStr.slice(tIdx)}`;
    }
    const parsed = new Date(origStr);
    if (!Number.isNaN(parsed.getTime())) {
      const iso = parsed.toISOString();
      const t = iso.indexOf('T');
      if (t !== -1) return `${dateInput}${iso.slice(t)}`;
    }
  }
  return `${dateInput}T00:00:00.000Z`;
}

const IconProcedure = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);
const IconNotes = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PerformedProcedureForm = ({
  patients,
  doctors,
  treatments,
  loading = false,
  mode = 'create',
  initialProcedure,
  onSubmit,
  onUnchanged,
  onCancel,
}: PerformedProcedureFormProps) => {
  const [patientId, setPatientId] = useState(
    () =>
      mode === 'edit' && initialProcedure
        ? (initialProcedure.patientId ?? initialProcedure.patient?.id ?? '')
        : '',
  );
  const [doctorId, setDoctorId] = useState(
    () =>
      mode === 'edit' && initialProcedure
        ? (initialProcedure.doctorId ?? initialProcedure.doctor?.id ?? '')
        : '',
  );
  const [treatmentId, setTreatmentId] = useState(
    () =>
      mode === 'edit' && initialProcedure
        ? (initialProcedure.treatmentId ?? initialProcedure.treatment?.id ?? '')
        : '',
  );
  const [linkPlanId, setLinkPlanId] = useState(() => initialPlanLink(initialProcedure).planId);
  const [linkItemId, setLinkItemId] = useState(() => initialPlanLink(initialProcedure).itemId);
  const [tooth, setTooth] = useState(
    () => (mode === 'edit' && initialProcedure ? (initialProcedure.tooth ?? '') : ''),
  );
  const [description, setDescription] = useState(
    () => (mode === 'edit' && initialProcedure ? (initialProcedure.description ?? '') : ''),
  );
  const [notes, setNotes] = useState(
    () => (mode === 'edit' && initialProcedure ? (initialProcedure.notes ?? '') : ''),
  );
  const [performedAt, setPerformedAt] = useState(() => {
    if (mode === 'edit' && initialProcedure) {
      const pa = initialProcedure.performedAt;
      return typeof pa === 'string'
        ? pa.slice(0, 10)
        : new Date(pa).toISOString().slice(0, 10);
    }
    return new Date().toISOString().split('T')[0];
  });
  const [errors, setErrors] = useState<ProcedureFormErrors>({});

  const { data: patientPlans = [], isFetching: plansLoading } = useTreatmentPlansByPatient(patientId);

  const patientOptions = useMemo(() => patients
    .map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` })), [patients]);

  const doctorOptions = useMemo(() => doctors
    .map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` })), [doctors]);

  const treatmentOptions = useMemo(() => {
    const active = treatments
      .filter((t) => t.isActive)
      .map((t) => ({ value: t.id, label: `${t.name} — ${t.category}` }));
    if (mode === 'edit' && initialProcedure) {
      const tid = initialProcedure.treatmentId ?? initialProcedure.treatment?.id;
      if (tid && !active.some((o) => o.value === tid)) {
        const cur = treatments.find((t) => t.id === tid);
        if (cur && !cur.isActive) {
          return [{ value: cur.id, label: `${cur.name} — ${cur.category} (inactivo)` }, ...active];
        }
        if (initialProcedure.treatment?.id === tid) {
          const tr = initialProcedure.treatment;
          return [{ value: tr.id, label: `${tr.name} — ${tr.category} (no en catálogo activo)` }, ...active];
        }
      }
    }
    return active;
  }, [treatments, mode, initialProcedure]);

  const selectedPlan = useMemo(
    () => patientPlans.find((p) => p.id === linkPlanId),
    [patientPlans, linkPlanId],
  );

  const linkablePlanItems = useMemo(() => {
    if (!selectedPlan || !treatmentId) return [];
    const items = selectedPlan.items ?? [];
    return items.filter((it) => {
      if (it.treatmentId !== treatmentId) return false;
      if (
        it.status === TreatmentPlanStatus.PENDING ||
        it.status === TreatmentPlanStatus.IN_PROGRESS
      ) {
        return true;
      }
      if (mode === 'edit' && initialProcedure?.treatmentPlanItemId === it.id) return true;
      return false;
    });
  }, [selectedPlan, treatmentId, mode, initialProcedure?.treatmentPlanItemId]);

  const planSelectOptions = useMemo(
    () => [
      { value: '', label: 'Sin vínculo al plan' },
      ...patientPlans.map((p) => ({ value: p.id, label: getPlanSelectLabel(p) })),
    ],
    [patientPlans],
  );

  const itemSelectOptions = useMemo(() => {
    const base = { value: '', label: 'Solo al plan (sin ítem concreto)' };
    const rest = linkablePlanItems.map((it) => {
      const name = it.treatment?.name ?? 'Tratamiento';
      const st = PLAN_STATUS_CONFIG[it.status as TreatmentPlanStatus]?.label ?? it.status;
      return { value: it.id, label: `${name} — ${st}` };
    });
    return [base, ...rest];
  }, [linkablePlanItems]);

  const handlePatientChange = (id: string) => {
    setPatientId(id);
    setLinkPlanId('');
    setLinkItemId('');
    setErrors((p) => ({ ...p, patientId: undefined, planLink: undefined }));
  };

  const handleTreatmentChange = (id: string) => {
    setTreatmentId(id);
    setLinkItemId('');
    setErrors((p) => ({ ...p, treatmentId: undefined, planLink: undefined }));
  };

  const handlePlanChange = (planId: string) => {
    setLinkPlanId(planId);
    setLinkItemId('');
    setErrors((p) => ({ ...p, planLink: undefined }));
  };

  const validateStep1 = useCallback(() => {
    const stepErrors: ProcedureFormErrors = {};
    if (!patientId) stepErrors.patientId = 'Debe seleccionar un paciente';
    if (!doctorId) stepErrors.doctorId = 'Debe seleccionar un doctor';
    if (!treatmentId) stepErrors.treatmentId = 'Debe seleccionar un tratamiento';

    if (linkPlanId && !patientPlans.some((p) => p.id === linkPlanId)) {
      stepErrors.planLink = 'El plan seleccionado ya no está disponible para este paciente';
    }
    if (linkItemId) {
      const ok = linkablePlanItems.some((i) => i.id === linkItemId);
      if (!ok) {
        stepErrors.planLink =
          'El ítem del plan no coincide con el tratamiento o ya no se puede vincular';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [patientId, doctorId, treatmentId, linkPlanId, linkItemId, patientPlans, linkablePlanItems]);

  const handleSubmit: FormEventHandler = () => {
    const performedAtIso = buildPerformedAtIso(mode, performedAt, initialProcedure?.performedAt);
    const payload: CreatePerformedProcedureDto = {
      patientId,
      doctorId,
      treatmentId,
      performedAt: performedAtIso,
    };
    if (mode === 'edit') {
      payload.tooth = tooth.trim() ? tooth.trim() : null;
      payload.description = description.trim() ? description.trim() : null;
      payload.notes = notes.trim() ? notes.trim() : null;
      if (linkItemId) {
        payload.treatmentPlanItemId = linkItemId;
        payload.treatmentPlanId = null;
      } else if (linkPlanId) {
        payload.treatmentPlanId = linkPlanId;
        payload.treatmentPlanItemId = null;
      } else {
        payload.treatmentPlanItemId = null;
        payload.treatmentPlanId = null;
      }
    } else {
      payload.tooth = tooth.trim() || undefined;
      payload.description = description.trim() || undefined;
      payload.notes = notes.trim() || undefined;
      if (linkItemId) {
        payload.treatmentPlanItemId = linkItemId;
      } else if (linkPlanId) {
        payload.treatmentPlanId = linkPlanId;
      }
    }
    if (mode === 'edit' && initialProcedure && performedProcedureEditUnchanged(initialProcedure, payload)) {
      onUnchanged?.();
      return;
    }
    onSubmit(payload);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const steps: Step[] = [
    {
      title: 'Procedimiento',
      validate: validateStep1,
      content: (
        <FormSection
          title="Datos del Procedimiento"
          icon={<IconProcedure />}
          description="Opcionalmente vincule el registro a un plan del mismo paciente: solo al plan o a un ítem concreto (mismo tratamiento)."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Paciente *"
              options={patientOptions}
              value={patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              placeholder="Seleccionar..."
              error={errors.patientId}
            />
            <Select
              label="Doctor *"
              options={doctorOptions}
              value={doctorId}
              onChange={(e) => { setDoctorId(e.target.value); setErrors((p) => ({ ...p, doctorId: undefined })); }}
              placeholder="Seleccionar..."
              error={errors.doctorId}
            />
            <Select
              label="Tratamiento *"
              options={treatmentOptions}
              value={treatmentId}
              onChange={(e) => handleTreatmentChange(e.target.value)}
              placeholder="Seleccionar..."
              error={errors.treatmentId}
            />
            <DatePicker
              label="Fecha *"
              value={performedAt}
              onChange={(e) => setPerformedAt(e.target.value)}
            />
            <Input
              label="Pieza dental"
              placeholder="Ej: 18, 21"
              value={tooth}
              onChange={(e) => setTooth(e.target.value)}
              className="sm:col-span-2"
            />
            {patientId ? (
              <div className="sm:col-span-2 space-y-3 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Plan de tratamiento (opcional)
                </p>
                {plansLoading ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Spinner />
                    <span>Cargando planes…</span>
                  </div>
                ) : (
                  <>
                    <Select
                      label="Plan"
                      options={planSelectOptions}
                      value={linkPlanId}
                      onChange={(e) => handlePlanChange(e.target.value)}
                      placeholder="Sin vínculo"
                      error={errors.planLink}
                    />
                    {linkPlanId ? (
                      <Select
                        label="Ítem del plan"
                        options={itemSelectOptions}
                        value={linkItemId}
                        onChange={(e) => {
                          setLinkItemId(e.target.value);
                          setErrors((p) => ({ ...p, planLink: undefined }));
                        }}
                        placeholder="Solo al plan o elija ítem"
                        error={errors.planLink}
                      />
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
          </div>
        </FormSection>
      ),
    },
    {
      title: 'Detalles',
      content: (
        <FormSection title="Detalles" icon={<IconNotes />} description="Descripción y notas del procedimiento">
          <div className="space-y-4">
            <Textarea
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <Textarea
              label="Notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </FormSection>
      ),
    },
  ];

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      submitLabel={mode === 'edit' ? 'Guardar cambios' : 'Registrar'}
      loading={loading}
      onCancel={onCancel}
      onStepChange={() => setErrors({})}
      fillParent
    />
  );
};

export default PerformedProcedureForm;
