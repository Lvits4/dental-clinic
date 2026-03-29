import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Spinner, ConfirmDialog, Pagination } from '../../components/ui';
import FileUploadZone from '../../components/clinical-files/FileUploadZone';
import ClinicalFileCard from '../../components/clinical-files/ClinicalFileCard';
import { useClinicalFilesList } from '../../querys/clinical-files/queryClinicalFiles';
import { useUploadClinicalFile, useDeleteClinicalFile } from '../../querys/clinical-files/mutationClinicalFiles';

const ClinicalFilesListView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const limit = 12;

  const { data, isLoading } = useClinicalFilesList({ page, limit, patientId });
  const uploadMutation = useUploadClinicalFile(patientId!);
  const deleteMutation = useDeleteClinicalFile();

  const handleUpload = (file: File) => {
    uploadMutation.mutate({ file });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Archivos Clínicos"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Pacientes', to: '/patients' },
          { label: 'Paciente', to: `/patients/${patientId}` },
          { label: 'Archivos' },
        ]}
      />

      {/* Zona de carga */}
      <FileUploadZone onUpload={handleUpload} loading={uploadMutation.isPending} />

      {/* Galería */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !data?.data?.length ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">No hay archivos clínicos.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.data.map((file) => (
              <ClinicalFileCard
                key={file.id}
                file={file}
                onDelete={(id) => setDeleteId(id)}
                deleteLoading={deleteMutation.isPending && deleteId === file.id}
              />
            ))}
          </div>

          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.totalItems}
            limit={data.meta.limit}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar archivo"
        message="¿Estás seguro de eliminar este archivo? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ClinicalFilesListView;
