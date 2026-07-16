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
    <main>
      <h1>Maintenance Dashboard</h1>

      <section>
        <p>Total: {dashboard.total}</p>
        <p>Preventivas: {dashboard.preventive}</p>
        <p>Corretivas: {dashboard.corrective}</p>
        <p>Pendentes: {dashboard.pending}</p>
        <p>Concluídas: {dashboard.completed}</p>
      </section>
    </main>
  );
}