import SubmitButton from "./SubmitButton";

export default function MaintenanceForm({
  title,
  viewModel,
  onSuccess,
  button,
}) {
  return (
    <form
      className="stack"
      onSubmit={async (event) => {
        event.preventDefault();

        const success = await viewModel.submit();

        if (success) {
          onSuccess?.();
        }
      }}
    >
      <h1 className="vessel-hero__title">{title}</h1>

      <select
        className="select"
        value={viewModel.vesselId}
        onChange={(event) => viewModel.setVesselId(event.target.value)}
      >
        <option value="">Selecione a embarcação</option>
        {viewModel.vessels.map((vessel) => (
          <option key={vessel.id} value={vessel.id}>
            {vessel.name}
          </option>
        ))}
      </select>

      <input
        className="input"
        type="text"
        placeholder="Título"
        value={viewModel.title}
        onChange={(event) => viewModel.setTitle(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Descrição"
        value={viewModel.description}
        onChange={(event) => viewModel.setDescription(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Tipo (ex.: Preventiva)"
        value={viewModel.type}
        onChange={(event) => viewModel.setType(event.target.value)}
      />

      <input
        className="input"
        type="date"
        value={viewModel.date}
        onChange={(event) => viewModel.setDate(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Status (ex.: Pendente)"
        value={viewModel.status}
        onChange={(event) => viewModel.setStatus(event.target.value)}
      />

      <SubmitButton
        busy={viewModel.isLoading}
        idleLabel={button}
        busyLabel="Salvando..."
      />

      {viewModel.error && <p className="field__error">{viewModel.error}</p>}
      {viewModel.successMessage && (
        <p className="badge badge--success">{viewModel.successMessage}</p>
      )}
    </form>
  );
}
