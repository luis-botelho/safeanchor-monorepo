import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { demoAccounts, demoProfile } from "../mock/users";

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
  const [initializing] = useState(false);

  const login = useCallback(async (email, password) => {
    const account =
      demoAccounts.find(
        (item) =>
          item.email.toLowerCase() === email.toLowerCase() &&
          item.password === password,
      ) || null;

    const profile = account
      ? account.profile
      : {
          ...demoProfile,
          id: "usr-demo",
          name: email.split("@")[0] || demoProfile.name,
          fullName: email.split("@")[0] || demoProfile.name,
          email: email || demoProfile.email,
          initials: (email.split("@")[0] || "U").slice(0, 2).toUpperCase(),
        };

    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);

    return profile;
  }, []);

  const register = useCallback(
    async (name, email, password) => {
      const profile = {
        id: `usr-${Date.now()}`,
        name: name.split(" ")[0] || name,
        fullName: name || "Novo Membro",
        email,
        role: "Proprietário",
        company: "Minha embarcação",
        location: "Florianópolis, SC",
        since: "2026",
        initials: name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || "NM",
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      setUser(profile);

      return profile;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

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