import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import Rating from "../components/Rating";

import { getBoatRentals } from "../services/boatRentalService";
import { getOwnerRentals } from "../services/boatRentalService";
import { useAuth } from "../context/AuthContext";

const FILTERS = ["Todas", "Com capitão", "Sem capitão", "Disponíveis"];

export default function BoatRentalsPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [mine, setMine] = useState([]);
  const [filter, setFilter] = useState("Todas");

  useEffect(() => {
    getBoatRentals().then(setRentals);
    if (user?.id) {
      getOwnerRentals(user.id).then(setMine);
    }
  }, [user]);

  const visible = rentals.filter((rental) => {
    if (filter === "Com capitão") return rental.captainIncluded;
    if (filter === "Sem capitão") return !rental.captainIncluded;
    if (filter === "Disponíveis") return rental.availabilityTone === "success";
    return true;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Aluguel de embarcações"
        title="Boat Rentals"
        subtitle="Embarcações para alugar com ou sem capitão, serviços extras e experiências — conectadas ao charter e ao ecossistema."
      />

      <div className="tags" style={{ marginBottom: 16 }}>
        {FILTERS.map((item) => (
          <button
            type="button"
            className={`tag ${filter === item ? "tag--active" : ""}`}
            key={item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid--3">
        {visible.map((rental) => (
          <div className="listing-card" key={rental.id}>
            <div className="listing-card__media">
              <span className="listing-card__img listing-card__img--boat">
                <Icon name="boat" size={26} />
              </span>
              <StatusBadge
                label={rental.availability}
                tone={rental.availabilityTone}
              />
            </div>
            <div className="listing-card__body">
              <div className="listing-card__title">
                <h3>{rental.vesselName}</h3>
                <Rating value={rental.rating} size={15} />
              </div>
              <p className="listing-card__meta">
                {rental.location} · {rental.capacity} pessoas
              </p>
              <p className="listing-card__price">
                {rental.pricePerDay.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
                <span>/dia</span>
              </p>
              <div className="listing-card__footer">
                <span className="badge badge--neutral">
                  {rental.captainIncluded ? "Com capitão" : "Sem capitão"}
                </span>
                <Link className="btn btn--ghost" to={`/boat-rentals/${rental.id}`}>
                  Ver e montar charter
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="page-header__subtitle">Nenhuma embarcação neste filtro.</p>
      )}

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <div className="ai-banner">
          <span className="ai-banner__icon">
            <Icon name="fleet" size={20} />
          </span>
          <div>
            <strong>Sua embarcação também pode ser listada</strong>
            <p>
              {mine.length > 0
                ? `Você já tem ${mine.length} anúncio(s) no marketplace de aluguel.`
                : "Liste sua embarcação para gerar renda enquanto navega menos."}
            </p>
            <Link className="section-title__link" to="/profiles">
              Configurar anúncio (demo)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}