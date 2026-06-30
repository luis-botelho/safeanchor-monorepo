import { useVesselDetailsViewModel } from "../viewmodels/useVesselDetailsViewModel";
import { useParams } from "react-router-dom";

export default function VesselDetailsPage() {
  const { id } = useParams();
  const viewModel = useVesselDetailsViewModel(id);
  if (viewModel.isLoading) {
    return <p>Carregando...</p>;
  }
  if (viewModel.error) {
    return <p>{viewModel.error}</p>;
  }
  const vessel = viewModel.vessel;

  return(
    <main className="vessel-details">
        <section className="vessel-details__container">
            <h1 className="vessel-details__title">Embarcação</h1>
            <div className="vessel-details__info-group"><h2 className="vessel-details__label">Nome</h2><span className="vessel-details__value">{vessel.name}</span></div>
            <div className="vessel-details__info-group"><span className="vessel-details__label">Tipo</span><span className="vessel-details__value">{vessel.type}</span></div>
            <div className="vessel-details__info-group"><span className="vessel-details__label">Status</span><span className="vessel-details__value">{vessel.status}</span></div>
        </section>
    </main>
  )
}
