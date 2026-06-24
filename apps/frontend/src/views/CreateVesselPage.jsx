import { useCreateVesselViewModel } from "../viewmodels/useCreateVesselViewModel";

export default function CreateVesselPage() {
  const viewModel = useCreateVesselViewModel();

  return (
    <main>
      <h1>Cadastrar Embarcação</h1>

      <input
        type="text"
        placeholder="Nome"
        value={viewModel.name}
        onChange={(event) => viewModel.setName(event.target.value)}
      />

      <input
        type="text"
        placeholder="Tipo"
        value={viewModel.type}
        onChange={(event) => viewModel.setType(event.target.value)}
      />

      <input
        type="text"
        placeholder="Status"
        value={viewModel.status}
        onChange={(event) => viewModel.setStatus(event.target.value)}
      />

      <button
        onClick={viewModel.submit}
        disabled={viewModel.isLoading}
      >
        {viewModel.isLoading ? "Salvando..." : "Cadastrar"}
      </button>

      {viewModel.error && (
        <p>{viewModel.error}</p>
      )}
    </main>
  );
}