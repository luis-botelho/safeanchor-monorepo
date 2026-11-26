import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AppShell from "./AppShell";
import LoadingFallback from "./LoadingFallback";

export default function DirectorRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingFallback label="Validando acesso da diretoria" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!["DIRECTOR", "ADMIN"].includes(user.roleKey)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppShell />;
}
