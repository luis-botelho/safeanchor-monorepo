import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { clearToken } from "../services/api";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Token e perfil ficam apenas em memória. Ao recarregar, a demo pede login
  // novamente — o access token expira em 15 minutos e não há refresh cookie.
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(false);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Token pode já estar expirado ou revogado; limpa a sessão local mesmo assim.
    }

    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener("auth:unauthorized", logout);

    return () => window.removeEventListener("auth:unauthorized", logout);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const profile = await loginUser({ email, password });
    setUser(profile);

    return profile;
  }, []);

  const register = useCallback(
    async (name, email, password, persona) => {
      const profile = await registerUser({ name, email, password, persona });
      setUser(profile);

      return profile;
    },
    [],
  );

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
