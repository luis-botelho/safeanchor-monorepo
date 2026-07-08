import { useEditVesselViewModel } from "../viewmodels/useEditVesselViewModel";
import VesselForm from "../components/VesselForm";
import { useParams, useNavigate } from "react-router-dom";

export default function EditVesselPage({ onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const viewModel = useEditVesselViewModel(id);

  return (
    <VesselForm
      title="Editar Embarcação"
      viewModel={viewModel}
      onSuccess={() => navigate("/")}
      button='Atualizar'
    />
  );
}
