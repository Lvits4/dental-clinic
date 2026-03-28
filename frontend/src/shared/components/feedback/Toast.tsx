import toast, { Toaster } from 'react-hot-toast';

export { toast as toastNotify };

export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '8px',
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: {
          style: {
            background: '#10B981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
      }}
    />
  );
}

// Hook wrapper para mantener compatibilidad
export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) =>
      toast(message, {
        icon: '⚠️',
        style: { background: '#F59E0B', color: '#fff' },
      }),
    info: (message: string) =>
      toast(message, {
        icon: 'ℹ️',
        style: { background: '#3B82F6', color: '#fff' },
      }),
  };
}
