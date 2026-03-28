import toast from 'react-hot-toast';

// Hook de conveniencia para usar toast en cualquier componente
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
