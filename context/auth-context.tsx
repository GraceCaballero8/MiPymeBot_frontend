import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useFetchApi from "../hooks/use-fetch";
import type {
  User,
  LoginCredentials,
  AuthResponse,
} from "@/app/interfaces/auth.interface";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkUserSession: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe estar dentro de AuthProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { get, post } = useFetchApi();

  const checkUserSession = useCallback(async () => {
    // Si no hay token, no hay sesión activa
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    try {
      const userData = await get<User>("/users/me");
      setUser(userData);
    } catch (error) {
      // Si falla, limpiar sesión
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  }, [get]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await post<AuthResponse, LoginCredentials>(
          "/auth/login",
          credentials
        );

        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.token);
        }
        setToken(response.token);

        // Cargar datos completos del usuario desde el backend
        try {
          const userData = await get<User>("/users/me");
          setUser(userData);
        } catch {
          // Si falla, usar los datos de la respuesta de login
          setUser(response.user);
        }
      } catch (error) {
        throw error;
      }
    },
    [post, get]
  );

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, checkUserSession }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
