import { useParams } from "react-router-dom";

import { useInspectionHistoryViewModel } from "../viewmodels/useInspectionHistoryViewModel";

export default function InspectionHistoryPage() {
  const { id } = useParams();

  const {
    inspections,
    isLoading,
    error,
    orderedInspections,
    sortOrder,
    setSortOrder,
  } = useInspectionHistoryViewModel(id);

  if (isLoading) {
    return <p>Carregando inspeções...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Inspection History</h1>
      
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="desc">Mais recentes</option>
        <option value="asc">Mais antigas</option>
      </select>

      <p>Total de inspeções: {inspections.length}</p>
      {inspections.length === 0 ? (
        <p>Nenhuma inspeção encontrada.</p>
      ) : (
        <ul>
          {orderedInspections.map((inspection) => (
            <li key={inspection.id}>
              <strong>{inspection.templateId}</strong>

              <p>
                Executada em:{" "}
                {new Date(inspection.executedAt).toLocaleDateString()}
              </p>

              <p>{inspection.responses}</p>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
      >
        Ordenar
      </button>
    </div>
  );
}
