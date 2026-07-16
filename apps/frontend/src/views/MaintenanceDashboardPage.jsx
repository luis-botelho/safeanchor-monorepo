import { Link } from "react-router-dom";
import { useMaintenanceDashboardViewModel } from "../viewmodels/useMaintenanceDashboardViewModel";

export default function MaintenanceDashboardPage() {
  const viewModel = useMaintenanceDashboardViewModel();

  if (viewModel.isLoading) {
    return <p>Carregando...</p>;
  }

  if (viewModel.error) {
    return <p>{viewModel.error}</p>;
  }

  const dashboard = viewModel.dashboard;

  return (
    <main className="maintenance-dashboard">
      <header className="maintenance-dashboard__header">
        <h1>Dashboard de Manutenção</h1>

        <Link to="/maintenances">
          Ver Manutenções
        </Link>
      </header>

      <section className="maintenance-dashboard__cards">

        <article>
          <h2>Total</h2>
          <strong>{dashboard.total}</strong>
        </article>

        <article>
          <h2>Preventivas</h2>
          <strong>{dashboard.preventive}</strong>
        </article>

        <article>
          <h2>Corretivas</h2>
          <strong>{dashboard.corrective}</strong>
        </article>

        <article>
          <h2>Pendentes</h2>
          <strong>{dashboard.pending}</strong>
        </article>

        <article>
          <h2>Concluídas</h2>
          <strong>{dashboard.completed}</strong>
        </article>

      </section>
    </main>
  );
}