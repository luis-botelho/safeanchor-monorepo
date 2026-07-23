import { useNavigate } from "react-router-dom";

import ChecklistExecutionForm from "../components/ChecklistExecutionForm";
import { useChecklistExecutionViewModel } from "../viewmodels/useChecklistExecutionViewModel";

export default function CreateChecklistExecutionPage() {
  const navigate = useNavigate();

  const viewModel = useChecklistExecutionViewModel();

  return (
    <ChecklistExecutionForm
      title="Nova Execução de Checklist"
      button="Salvar Execução"
      viewModel={viewModel}
      onSuccess={() => navigate("/checklist-executions")}
    />
  );
}