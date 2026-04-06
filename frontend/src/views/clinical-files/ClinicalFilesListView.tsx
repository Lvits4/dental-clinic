import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Spinner, ConfirmDialog, Pagination, Button } from '../../components/ui';
import FileUploadZone from '../../components/clinical-files/FileUploadZone';
import ClinicalFileCard from '../../components/clinical-files/ClinicalFileCard';
import { useClinicalFilesList } from '../../querys/clinical-files/queryClinicalFiles';
import { totalPagesFromMeta } from '../../utils/pagination';
import { LIST_PAGE_SIZE_MAX } from '../../constants/pagination';

const CLINICAL_FILES_DEFAULT_PAGE_SIZE = 12;
import { useUploadClinicalFile, useDeleteClinicalFile } from '../../querys/clinical-files/mutationClinicalFiles';

const ClinicalFilesListView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [limit, setLimit] = useState(CLINICAL_FILES_DEFAULT_PAGE_SIZE);

  const { data, isLoading, isError, refetch } = useClinicalFilesList({ page, limit, patientId });
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

  useEffect(() => {
    if (isError || !data?.meta) return;
    const tp = totalPagesFromMeta(data.meta, limit);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta, isError, limit]);

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
      ) : isError ? (
        <div className="bg-white dark:bg-slate-800 rounded-md border border-red-200 dark:border-red-900/40 p-8 text-center space-y-3">
          <p className="text-red-700 dark:text-red-300">No se pudieron cargar los archivos clínicos.</p>
          <Button type="button" variant="secondary" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (data?.meta?.totalItems ?? 0) === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">No hay archivos clínicos.</p>
        </div>
      ) : (
        <>
          {data && data.data.length > 0 ? (
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
          ) : (
            <p className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
              No hay archivos en esta página.
            </p>
          )}

          {data?.meta ? (
            <Pagination
              page={page}
              totalPages={totalPagesFromMeta(data.meta, limit)}
              total={data.meta.totalItems}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(n) => {
                setLimit(n);
                setPage(1);
              }}
              minLimit={1}
              maxLimit={LIST_PAGE_SIZE_MAX}
            />
          ) : null}
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
