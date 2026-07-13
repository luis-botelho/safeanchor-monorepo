import { useMaintenancesViewModel } from "../viewmodels/useMaintenancesViewModel";
import { Link } from "react-router-dom";

export default function MaintenancesPage() {
  const viewModel = useMaintenancesViewModel();

  if (viewModel.isLoading) {
    return <p>Carregando...</p>;
  }
  if (viewModel.error) {
    return <p>{viewModel.error}</p>;
  }

  return (
    <main>
      <h1>Manutenções</h1>
      <Link to="/maintenances/create">Nova Manutenção</Link>
      {viewModel.maintenances.map((maintenance) => (
        <div key={maintenance.id}>
          <h2>{maintenance.title}</h2>

          <p>Tipo: {maintenance.type}</p>

          <p>Status: {maintenance.status}</p>

          <p>Data: {maintenance.date}</p>
        </div>
      ))}
    </main>
  );
}
