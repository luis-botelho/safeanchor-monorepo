import { useCreateVesselViewModel } from "../viewmodels/useCreateVesselViewModel";
import VesselForm from "../components/VesselForm";

export default function CreateVesselPage({ onSuccess }) {
  const viewModel = useCreateVesselViewModel();

  return (
    <main>
      <VesselForm title={"Cadastrar Embarcação"}viewModel={viewModel} onSuccess={onSuccess} />
    </main>
  );
}
