import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

interface FileUploadZoneProps {
  onUpload: (file: File) => void;
  loading?: boolean;
  accept?: string;
  /** Tamaño máximo en bytes (debe coincidir con el límite del backend). */
  maxBytes?: number;
}

const FileUploadZone = ({
  onUpload,
  loading = false,
  accept = 'image/*,.pdf,.doc,.docx',
  maxBytes = DEFAULT_MAX_BYTES,
}: FileUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.size === 0) {
      toast.error('El archivo está vacío');
      return;
    }
    if (file.size > maxBytes) {
      toast.error(`El archivo supera el máximo de ${Math.round(maxBytes / (1024 * 1024))} MB`);
      return;
    }
    onUpload(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
      e.target.value = '';
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={[
        'flex flex-col items-center justify-center gap-3 p-8 rounded-md border-2 border-dashed cursor-pointer transition-colors',
        isDragging
          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 bg-white dark:bg-slate-800',
        loading ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
    >
      <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />

      <svg
        className="w-10 h-10 text-slate-400 dark:text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>

      <div className="text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {loading ? 'Subiendo...' : 'Arrastra un archivo aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Imágenes, PDF, Word — máximo recomendado 10 MB
        </p>
      </div>
    </div>
  );
};

export default FileUploadZone;
