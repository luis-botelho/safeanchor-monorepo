import { documentCategories } from "../mock/documents";

export default function DocumentForm({ title, viewModel, onSuccess, button }) {
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
        placeholder="Nome (ex.: Seguro da embarcação)"
        value={viewModel.name}
        onChange={(event) => viewModel.setName(event.target.value)}
      />

      <select
        className="select"
        value={viewModel.category}
        onChange={(event) => viewModel.setCategory(event.target.value)}
      >
        <option value="">Selecione a categoria</option>
        {documentCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        className="input"
        type="text"
        placeholder="Número do documento"
        value={viewModel.number}
        onChange={(event) => viewModel.setNumber(event.target.value)}
      />

      <div style={{ display: "flex", gap: 12 }}>
        <input
          className="input"
          type="date"
          aria-label="Início da validade"
          value={viewModel.validFrom}
          onChange={(event) => viewModel.setValidFrom(event.target.value)}
          style={{ flex: 1 }}
        />
        <input
          className="input"
          type="date"
          aria-label="Vencimento"
          value={viewModel.expiresAt}
          onChange={(event) => viewModel.setExpiresAt(event.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <input
        className="input"
        type="text"
        placeholder="Órgão ou prestador (opcional)"
        value={viewModel.provider}
        onChange={(event) => viewModel.setProvider(event.target.value)}
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
