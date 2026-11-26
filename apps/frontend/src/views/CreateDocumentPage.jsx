import { useNavigate } from "react-router-dom";

import { useCreateDocumentViewModel } from "../viewmodels/useCreateDocumentViewModel";
import { BackLink } from "../components/PageHeader";
import DocumentForm from "../components/DocumentForm";

export default function CreateDocumentPage() {
  const navigate = useNavigate();
  const viewModel = useCreateDocumentViewModel();

  return (
    <div>
      <BackLink to="/documents" label="Voltar para documentos" />

      <main className="card card--padding" style={{ marginTop: 18 }}>
        <DocumentForm
          title="Cadastrar documento"
          viewModel={viewModel}
          onSuccess={() => navigate("/documents")}
          button="Cadastrar"
        />
      </main>
    </div>
  );
}
