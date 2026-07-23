import { useNavigate } from "react-router-dom";

import ChecklistTemplateForm from "../components/ChecklistTemplateForm";
import { useChecklistTemplatesViewModel } from "../viewmodels/useChecklistTemplatesViewModel";

export default function CreateChecklistTemplatePage() {
  const navigate = useNavigate();

  const viewModel = useChecklistTemplatesViewModel();

  return (
    <ChecklistTemplateForm
      title="Novo Template de Checklist"
      button="Salvar Template"
      viewModel={viewModel}
      onSuccess={() => navigate("/checklist-templates")}
    />
    
  );
}