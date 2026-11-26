import { useNavigate } from "react-router-dom";

import { useCreateMaintenanceViewModel } from "../viewmodels/useCreateMaintenanceViewModel";
import MaintenanceForm from "../components/MaintenanceForm";

export default function CreateMaintenancePage() {
  const navigate = useNavigate();
  const viewModel = useCreateMaintenanceViewModel();

  return (
    <main className="card card--padding">
      <MaintenanceForm
        title="Cadastrar manutenção"
        button="Cadastrar"
        viewModel={viewModel}
        onSuccess={() => navigate("/maintenance")}
      />
    </main>
  );
}
