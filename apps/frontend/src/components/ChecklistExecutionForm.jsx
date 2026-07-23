export default function ChecklistExecutionForm({
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
        type="number"
        placeholder="ID do template"
        value={viewModel.templateId}
        onChange={(event) => viewModel.setTemplateId(event.target.value)}
      />

      <input
        type="number"
        placeholder="ID da embarcação"
        value={viewModel.vesselId}
        onChange={(event) => viewModel.setVesselId(event.target.value)}
      />

      <textarea
        placeholder="Digite uma resposta por linha"
        value={viewModel.responses}
        onChange={(event) => viewModel.setResponses(event.target.value)}
        rows={8}
      />

      <input
        type="datetime-local"
        value={viewModel.executedAt}
        onChange={(event) => viewModel.setExecutedAt(event.target.value)}
      />

      <button type="submit">
        {viewModel.isLoading ? "Salvando..." : button}
      </button>

      {viewModel.error && <p>{viewModel.error}</p>}
      {viewModel.successMessage && <p>{viewModel.successMessage}</p>}
    </form>
  );
}