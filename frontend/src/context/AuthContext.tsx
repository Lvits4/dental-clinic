import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { http } from '../helpers/http';
import { ENDPOINTS } from '../config/api';
import type { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (token: string, user: User) => void;
  /** Tras PATCH perfil: actualiza usuario y opcionalmente el token si el backend lo devuelve */
  updateSession: (user: User, accessToken?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('access_token'),
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Cargar perfil del usuario al iniciar si hay token
  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await http.get<User>(ENDPOINTS.PROFILE);
        if (cancelled) return;
        setUser(userData);
      } catch {
        if (cancelled) return;
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const setSession = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const updateSession = useCallback((newUser: User, accessToken?: string) => {
    setUser(newUser);
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      setToken(accessToken);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    window.location.hash = '#/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, setSession, updateSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
export default AuthProvider;
