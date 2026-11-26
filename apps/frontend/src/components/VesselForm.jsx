export default function VesselForm({ title, viewModel, onSuccess, button }) {
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

      <input
        className="input"
        type="text"
        placeholder="Nome"
        value={viewModel.name}
        onChange={(event) => viewModel.setName(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Tipo (ex.: Lancha)"
        value={viewModel.type}
        onChange={(event) => viewModel.setType(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Status (ex.: OPERACIONAL)"
        value={viewModel.status}
        onChange={(event) => viewModel.setStatus(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Categoria (opcional)"
        value={viewModel.category}
        onChange={(event) => viewModel.setCategory(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Comprimento (opcional)"
        value={viewModel.length}
        onChange={(event) => viewModel.setLength(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Ano (opcional)"
        value={viewModel.year}
        onChange={(event) => viewModel.setYear(event.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Motor (opcional)"
        value={viewModel.engine}
        onChange={(event) => viewModel.setEngine(event.target.value)}
      />

      <button className="btn btn--primary" type="submit" disabled={viewModel.isLoading}>
        {viewModel.isLoading ? "Salvando..." : button}
      </button>

      {viewModel.error && <p className="field__error">{viewModel.error}</p>}
      {viewModel.successMessage && (
        <p className="badge badge--success">{viewModel.successMessage}</p>
      )}
    </form>
  );
}
