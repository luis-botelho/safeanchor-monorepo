import { Link } from "react-router-dom";
import { usePreventiveMaintenancesViewModel } from "../viewmodels/usePreventiveMaintenancesViewModel";

export default function PreventiveMaintenancesPage() {
  const viewModel = usePreventiveMaintenancesViewModel();

  if (viewModel.isLoading) {
    return <p>Carregando...</p>;
  }

  if (viewModel.error) {
    return <p>{viewModel.error}</p>;
  }

  return (
    <main>
      <h1>Manutenções Preventivas</h1>

      <Link to="/preventive-maintenances/create">
        Nova manutenção preventiva
      </Link>

      {viewModel.preventiveMaintenances.map((maintenance) => (
        <article key={maintenance.id}>
          <h2>{maintenance.title}</h2>

          <p>{maintenance.description}</p>

          <p>Embarcação: {maintenance.vesselId}</p>

          <p>Periodicidade: {maintenance.periodicity}</p>

          <p>Próxima execução: {maintenance.nextExecution}</p>

          <p>Status: {maintenance.status}</p>
        </article>
      ))}
    </main>
  );
}