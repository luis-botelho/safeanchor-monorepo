export default function MaintenanceForm({
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
        placeholder="Descrição"
        value={viewModel.description}
        onChange={(event) => viewModel.setDescription(event.target.value)}
      />

      <input
        type="text"
        placeholder="Tipo"
        value={viewModel.type}
        onChange={(event) => viewModel.setType(event.target.value)}
      />

      <input
        type="date"
        value={viewModel.date}
        onChange={(event) => viewModel.setDate(event.target.value)}
      />

      <input
        type="text"
        placeholder="Status"
        value={viewModel.status}
        onChange={(event) => viewModel.setStatus(event.target.value)}
      />

      <button type="submit">{button}</button>

      {viewModel.error && <p>{viewModel.error}</p>}
      {viewModel.successMessage && <p>{viewModel.successMessage}</p>}
    </form>
  );
}
