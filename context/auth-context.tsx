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
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const { get, post } = useFetchApi();

  const checkUserSession = useCallback(async () => {
    // Si no hay token, no hay sesión activa
    if (!localStorage.getItem("token")) {
      setIsLoading(false);
      return;
    }

    try {
      const statusResponse = await get<{ user: User }>("/users/me");
      setUser(statusResponse.user);
    } catch (error) {
      // Si falla, limpiar sesión
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
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

        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUser(response.user);
      } catch (error) {
        throw error;
      }
    },
    [post]
  );

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, checkUserSession }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
