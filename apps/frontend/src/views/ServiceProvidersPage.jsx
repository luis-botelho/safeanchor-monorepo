import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { filterProviders, getSpecialities } from "../services/providerService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import Rating from "../components/Rating";
import Icon from "../components/Icon";

const locations = ["Todas", "Grande Florianópolis", "Florianópolis e região", "Norte de SC", "Itajaí e região", "Toda a costa de SC"];

export default function ServiceProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [speciality, setSpeciality] = useState("Todas");
  const [location, setLocation] = useState("Todas");
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    setSpecialities(getSpecialities());
  }, []);

  useEffect(() => {
    filterProviders({ speciality, location }).then(setProviders);
  }, [speciality, location]);

  return (
    <div>
      <PageHeader
        eyebrow="Rede de serviços"
        title="Prestadores"
        subtitle="Encontre profissionais avaliados pela comunidade náutica para manter sua frota em dia."
        actions={
          <Link className="btn btn--primary" to="/service-requests/new">
            Solicitar serviço
          </Link>
        }
      />

      <div className="filters">
        <div className="field">
          <label className="field__label" htmlFor="filter-speciality">
            Especialidade
          </label>
          <select
            id="filter-speciality"
            className="select"
            value={speciality}
            onChange={(event) => setSpeciality(event.target.value)}
          >
            {specialities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="filter-location">
            Região
          </label>
          <select
            id="filter-location"
            className="select"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {providers.length === 0 ? (
        <section className="card">
          <div className="card--padding">
            <p className="page-header__subtitle">
              Nenhum prestador encontrado para esses filtros.
            </p>
          </div>
        </section>
      ) : (
        <div className="grid grid--2">
          {providers.map((provider) => (
            <Link className="card provider-card" to={`/service-providers/${provider.id}`} key={provider.id}>
              <Avatar
                initials={provider.initials}
                size={48}
                tone={provider.rating >= 4.8 ? "success" : "neutral"}
              />
              <div className="provider-card__body">
                <div className="provider-card__title">
                  {provider.name}
                  {provider.isPartner && (
                    <StatusBadge label="Parceiro SafeAnchor" tone="accent" />
                  )}
                </div>
                <p className="provider-card__company">{provider.company}</p>
                <p className="provider-card__role">
                  {provider.role} · {provider.location}
                </p>
                <div className="provider-card__meta">
                  <Rating value={provider.rating} />
                  <span className="provider-card__role">
                    {provider.reviewsCount} avaliações
                  </span>
                  <StatusBadge
                    label={provider.availability}
                    tone={provider.availabilityTone}
                  />
                </div>
                <div className="tags">
                  {provider.specialities.slice(0, 3).map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <span className="provider-card__arrow">
                <Icon name="back" size={16} style={{ transform: "rotate(180deg)" }} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}