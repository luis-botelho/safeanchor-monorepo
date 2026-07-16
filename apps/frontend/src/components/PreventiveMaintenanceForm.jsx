export default function PreventiveMaintenanceForm({
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
        onChange={(e) => viewModel.setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descrição"
        value={viewModel.description}
        onChange={(e) => viewModel.setDescription(e.target.value)}
      />

      {/* Depois isso será um select */}
      <input
        type="text"
        placeholder="Tipo"
        value={viewModel.type}
        onChange={(e) => viewModel.setType(e.target.value)}
      />

      {/* Depois isso será um select */}
      <input
        type="text"
        placeholder="Status"
        value={viewModel.status}
        onChange={(e) => viewModel.setStatus(e.target.value)}
      />

      <input
        type="number"
        placeholder="ID da embarcação"
        value={viewModel.vesselId}
        onChange={(e) => viewModel.setVesselId(e.target.value)}
      />

      <select
        value={viewModel.periodicity}
        onChange={(e) => viewModel.setPeriodicity(e.target.value)}
      >
        <option value="">Periodicidade</option>
        <option value="monthly">Mensal</option>
        <option value="quarterly">Trimestral</option>
        <option value="semiannual">Semestral</option>
        <option value="annual">Anual</option>
      </select>

      <input
        type="date"
        value={viewModel.startDate}
        onChange={(e) => viewModel.setStartDate(e.target.value)}
      />

      <button type="submit">
        {button}
      </button>

      {viewModel.error && <p>{viewModel.error}</p>}
      {viewModel.successMessage && <p>{viewModel.successMessage}</p>}
    </form>
  );
}