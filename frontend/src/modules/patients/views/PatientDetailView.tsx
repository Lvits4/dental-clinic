import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePatientDetail } from '../hooks/usePatientDetail';
import { useDeletePatient } from '../hooks/useDeletePatient';
import PatientCard from '../components/PatientCard';
import Button from '../../../shared/components/ui/Button';
import ConfirmDialog from '../../../shared/components/ui/ConfirmDialog';
import Spinner from '../../../shared/components/feedback/Spinner';

export default function PatientDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading } = usePatientDetail(id!);
  const deleteMutation = useDeletePatient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Paciente no encontrado</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteMutation.mutate(id!, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        navigate('/patients');
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            to="/patients"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Detalle de Paciente
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/patients/${id}/clinical-record`}>
            <Button variant="ghost">Expediente</Button>
          </Link>
          <Link to={`/patients/${id}/evolutions`}>
            <Button variant="ghost">Evoluciones</Button>
          </Link>
          <Link to={`/patients/${id}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          {patient.isActive && (
            <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
              Desactivar
            </Button>
          )}
        </div>
      </div>

      <PatientCard patient={patient} />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Desactivar paciente"
        message={`¿Estás seguro de desactivar a ${patient.firstName} ${patient.lastName}? El paciente no será eliminado, solo se marcará como inactivo.`}
        confirmLabel="Desactivar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
