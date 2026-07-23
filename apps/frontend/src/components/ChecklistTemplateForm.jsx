export default function ChecklistTemplateForm({
  title,
  viewModel,
  onSuccess,
  button,
}) {
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
        placeholder="Título"
        value={viewModel.title}
        onChange={(event) => viewModel.setTitle(event.target.value)}
      />

      <input
        type="text"
        placeholder="Tipo da embarcação"
        value={viewModel.vesselType}
        onChange={(event) => viewModel.setVesselType(event.target.value)}
      />

      <textarea
        placeholder="Digite um item por linha"
        value={viewModel.items}
        onChange={(event) => viewModel.setItems(event.target.value)}
        rows={8}
      />

      <button type="submit">
        {viewModel.isLoading ? "Salvando..." : button}
      </button>

      {viewModel.error && <p>{viewModel.error}</p>}

      {viewModel.successMessage && (
        <p>{viewModel.successMessage}</p>
      )}
    </form>
  );
}