import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';

interface FileUploadZoneProps {
  onUpload: (file: File) => void;
  loading?: boolean;
  accept?: string;
}

const FileUploadZone = ({
  onUpload,
  loading = false,
  accept = 'image/*,.pdf,.doc,.docx',
}: FileUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
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
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={[
        'flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
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
