import { Link, useParams } from "react-router-dom";
import { useMaintenanceHistoryViewModel } from "../viewmodels/useMaintenanceHistoryViewModel";

export default function MaintenanceHistoryPage() {
  const { id } = useParams();

  const viewModel = useMaintenanceHistoryViewModel(id);

  if (viewModel.isLoading) {
    return <p>Carregando histórico...</p>;
  }

  if (viewModel.error) {
    return <p>{viewModel.error}</p>;
  }

  return (
    <main className="maintenance-history">
      <h1>Histórico de Manutenções</h1>
      <div>
        <select
          value={viewModel.statusFilter}
          onChange={(e) => viewModel.setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluída">Concluída</option>
        </select>

        <select
          value={viewModel.typeFilter}
          onChange={(e) => viewModel.setTypeFilter(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          <option value="Preventiva">Preventiva</option>
          <option value="Corretiva">Corretiva</option>
        </select>
      </div>
      <Link to={`/vessels/${id}`}>← Voltar para embarcação</Link>

      {viewModel.maintenances.length === 0 ? (
        <p>Nenhuma manutenção encontrada.</p>
      ) : (
        viewModel.maintenances.map((maintenance) => (
          <div key={maintenance.id}>
            <h2>{maintenance.title}</h2>

            <p>Descrição: {maintenance.description}</p>

            <p>Tipo: {maintenance.type}</p>

            <p>Data: {maintenance.date}</p>

            <p>Status: {maintenance.status}</p>
          </div>
        ))
      )}
    </main>
  );
}
