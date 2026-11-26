import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { clearToken, getToken } from "../services/api";
import { getCurrentUser, loginUser, registerUser } from "../services/authService";

const SESSION_KEY = "safeanchor:session";

const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);

    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Sessão inválida; ignora.
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const [initializing, setInitializing] = useState(Boolean(getToken()));

  const saveUser = useCallback((profile) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!getToken()) {
      setInitializing(false);
      return;
    }

    let active = true;

    getCurrentUser()
      .then((profile) => {
        if (active) saveUser(profile);
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    return () => {
      active = false;
    };
  }, [logout, saveUser]);

  useEffect(() => {
    window.addEventListener("auth:unauthorized", logout);

    return () => window.removeEventListener("auth:unauthorized", logout);
  }, [logout]);

  const login = useCallback(
    async (email, password) => {
      const profile = await loginUser({ email, password });
      saveUser(profile);

      return profile;
    },
    [saveUser],
  );

  const register = useCallback(
    async (name, email, password, persona) => {
      const profile = await registerUser({ name, email, password, persona });
      saveUser(profile);

      return profile;
    },
    [saveUser],
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
