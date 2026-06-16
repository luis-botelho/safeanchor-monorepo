import { useVesselsViewModel } from "../viewmodels/useVesselsViewModel";

export function VesselsPage() {
  const { vessels, isLoading, source } = useVesselsViewModel();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Embarcações</h1>
      <p>{source === "api" ? "🟢 Backend conectado" : "🟡 Dados locais"}</p>
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
