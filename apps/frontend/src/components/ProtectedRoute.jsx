import LoadingFallback from "./LoadingFallback";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AppShell from "./AppShell";

export default function ProtectedRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingFallback label="Validando sessão" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}