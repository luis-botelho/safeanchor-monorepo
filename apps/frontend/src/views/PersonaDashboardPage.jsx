import { useAuth } from "../context/AuthContext";
import DashboardPage from "./DashboardPage";
import ProviderDashboardPage from "./ProviderDashboardPage";
import MarinaDashboardPage from "./MarinaDashboardPage";

export default function PersonaDashboardPage() {
  const { user } = useAuth();

  if (user?.persona === "SERVICE_PROVIDER") {
    return <ProviderDashboardPage />;
  }

  if (user?.persona === "MARINA") {
    return <MarinaDashboardPage />;
  }

  return <DashboardPage />;
}