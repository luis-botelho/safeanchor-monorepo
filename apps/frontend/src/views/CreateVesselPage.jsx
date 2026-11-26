import { useNavigate } from "react-router-dom";

import { useCreateVesselViewModel } from "../viewmodels/useCreateVesselViewModel";
import VesselForm from "../components/VesselForm";

export default function CreateVesselPage() {
  const navigate = useNavigate();
  const viewModel = useCreateVesselViewModel();

  return (
    <main className="card card--padding">
      <VesselForm
        title="Cadastrar embarcação"
        viewModel={viewModel}
        onSuccess={() => navigate("/fleet")}
        button="Cadastrar"
      />
    </main>
  );
}
