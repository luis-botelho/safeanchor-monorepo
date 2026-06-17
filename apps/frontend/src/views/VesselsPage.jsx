import { useVesselsViewModel } from "../viewmodels/useVesselsViewModel";

export function VesselsPage() {
  const { vessels, isLoading, source , hasError} = useVesselsViewModel();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Embarcações</h1>
      <p>{source === "api" ? "🟢 Backend conectado" : "🟡 Dados locais"}</p>
      {hasError && (
        <div className="alert" style={{ color: "red", margin: "10px 0" }}>
          Backend indisponível. Exibindo dados locais.
        </div>
      )}
      {vessels.map((vessel) => (
        <div key={vessel.id}>
          <h2>{vessel.name}</h2>

          <p>Tipo: {vessel.type}</p>

          <p>Status: {vessel.status}</p>
        </div>
      ))}
    </div>
  );
}
