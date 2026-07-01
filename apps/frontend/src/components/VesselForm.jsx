export default function VesselForm({ title, viewModel, onSuccess }) {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const success = await viewModel.submit();

        if (success) {
          onSuccess?.();
        }
      }}
    >
      <h1>{title}</h1>

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
        type="submit"
      >
        {viewModel.isLoading ? "Salvando..." : "Cadastrar"}
      </button>

      {viewModel.error && <p>{viewModel.error}</p>}
      {viewModel.successMessage && <p>{viewModel.successMessage}</p>}
    </form>
  );
}
