import { useNavigate } from "react-router-dom";
import PreventiveMaintenanceForm from "../components/PreventiveMaintenanceForm";
import { usePreventiveMaintenanceViewModel } from "../viewmodels/usePreventiveMaintenanceViewModel";

export default function CreatePreventiveMaintenancePage() {
  const navigate = useNavigate();

  const viewModel = usePreventiveMaintenanceViewModel();

  return (
    <PreventiveMaintenanceForm
      title="Cadastrar Manutenção Preventiva"
      button="Cadastrar"
      viewModel={viewModel}
      onSuccess={() => navigate("/preventive-maintenances")}
    />
  );
}