import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './common/global-context/ThemeContext';
import { AuthProvider } from './common/global-context/AuthContext';
import './common/styles/globals.css';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <App />
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
                  style: { background: '#10B981', color: '#fff' },
                  iconTheme: { primary: '#fff', secondary: '#10B981' },
                },
                error: {
                  style: { background: '#EF4444', color: '#fff' },
                  iconTheme: { primary: '#fff', secondary: '#EF4444' },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HashRouter>
  </StrictMode>,
);
