import type { ClinicalFile } from '../../types';
import { API_BASE_URL } from '../../config/api';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

interface ClinicalFileCardProps {
  file: ClinicalFile;
  onDelete: (id: string) => void;
  deleteLoading?: boolean;
}

const ClinicalFileCard = ({ file, onDelete, deleteLoading = false }: ClinicalFileCardProps) => {
  const downloadUrl = `${API_BASE_URL}/clinical-files/${file.id}/download`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Preview de imagen */}
      {isImage(file.mimeType) && (
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={downloadUrl}
            alt={file.fileName}
            className="w-full h-32 object-cover bg-slate-100 dark:bg-slate-700"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </a>
      )}

      {/* Info */}
      <div className="p-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={file.fileName}>
            {file.fileName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {file.fileType.toUpperCase()} — {formatFileSize(file.fileSize)}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDate(file.createdAt)}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Descargar */}
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20 transition-colors"
            title="Descargar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </a>

          {/* Eliminar */}
          <button
            onClick={() => onDelete(file.id)}
            disabled={deleteLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            title="Eliminar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalFileCard;
