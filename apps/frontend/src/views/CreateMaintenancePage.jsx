import { useCreateMaintenanceViewModel } from "../viewmodels/useCreateMaintenanceViewModel";
import MaintenanceForm from "../components/MaintenanceForm";

export default function CreateMaintenancePage() {
  const viewModel = useCreateMaintenanceViewModel();

  return (
    <MaintenanceForm
      title="Cadastrar Manutenção"
      button="Cadastrar"
      viewModel={viewModel}
    />
  );
}