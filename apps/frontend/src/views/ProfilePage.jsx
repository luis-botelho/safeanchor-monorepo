import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getFleetVessels, getVesselStatus } from "../services/vesselService";
import { getProviderById } from "../services/providerService";
import { getMarinaById } from "../services/marinaService";
import { getRequests } from "../services/requestService";
import { getDocumentsSummary, getDocuments } from "../services/documentService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import StatCard from "../components/StatCard";
import Icon from "../components/Icon";

export default function ProfilePage() {
  const { user } = useAuth();

  if (user?.persona === "SERVICE_PROVIDER") {
    return <ProviderProfile user={user} />;
  }

  if (user?.persona === "MARINA") {
    return <MarinaProfile user={user} />;
  }

  return <OwnerProfile user={user} />;
}

function OwnerProfile({ user }) {
  const [vessels, setVessels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getFleetVessels().then(setVessels);
    getRequests().then(setRequests);
    getDocuments().then(setDocuments);
  }, []);

  const docSummary = getDocumentsSummary(documents);
  const activeRequests = requests.filter((request) => request.status !== "Concluído");
  const tripsPlanned = 2;

  return (
    <div>
      <PageHeader
        eyebrow="Minha conta"
        title="Perfil"
        subtitle="Dados da conta demo, sua frota, viagens e reputação no ecossistema."
      />

      <section className="card card--padding">
        <div className="vessel-hero__main">
          <div className="provider-card__body">
            <div className="provider-card__title">
              {user?.fullName || user?.name}{" "}
              <StatusBadge label="Conta demo" tone="accent" />
            </div>
            <p className="provider-card__role">{user?.role}</p>
            <p className="provider-card__role" style={{ marginTop: 4 }}>
              {user?.email}
            </p>
            <div className="provider-card__stats">
              {user?.company && <span>{user.company}</span>}
              {user?.location && (
                <>
                  <span>·</span>
                  <span>{user.location}</span>
                </>
              )}
              {user?.since && (
                <>
                  <span>·</span>
                  <span>membro desde {user.since}</span>
                </>
              )}
            </div>
            <div className="tags" style={{ marginTop: 12 }}>
              <span className="tag tag--accent">Selo SafeAnchor</span>
              <span className="tag tag--accent">Proprietário verificado</span>
              <span className="tag">1 anúncio de aluguel</span>
            </div>
          </div>
          <Avatar initials={user?.initials || "U"} size={76} tone="success" />
        </div>
      </section>

      <div className="grid grid--4" style={{ marginTop: 18 }}>
        <StatCard label="Embarcações" value={vessels.length} icon="fleet" tone="primary" />
        <StatCard label="Viagens planejadas" value={tripsPlanned} icon="locationPin" tone="accent" />
        <StatCard label="Solicitações ativas" value={activeRequests.length} icon="send" tone="warning" />
        <StatCard label="Documentos válidos" value={docSummary.valid} icon="doc" tone="info" />
      </div>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Confiança e reputação</h2>
            <Link className="section-title__link" to="/ecosystem">
              Ver ecossistema
            </Link>
          </div>
        </div>
        <div className="grid grid--2" style={{ padding: "0 22px 22px" }}>
          <div className="ai-banner">
            <span className="ai-banner__icon"><Icon name="check" size={16} /></span>
            <div>
              <strong>Trust score</strong>
              <p>86/100 — avaliações honestas, float plan sempre preenchido e embarcações com prontidão acima de 50%.</p>
            </div>
          </div>
          <div className="ai-banner">
            <span className="ai-banner__icon"><Icon name="message" size={16} /></span>
            <div>
              <strong>Presença na comunidade</strong>
              <p>2 posts publicados e 1 viagem compartilhada — quanto mais conexões, maior a credibilidade nas solicitações.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Minha frota</h2>
          </div>
        </div>
        {vessels.map((vessel) => {
          const status = getVesselStatus(vessel.status);

          return (
            <div className="mnt" key={vessel.id}>
              <span className="mnt__icon">
                <Icon name="boat" size={18} />
              </span>
              <div>
                <p className="mnt__title">{vessel.name}</p>
                <p className="mnt__meta">
                  <span>{vessel.type} · {vessel.length}</span>
                  <StatusBadge label={status.label} tone={status.tone} />
                </p>
              </div>
              <div className="mnt__due">
                <span className="mnt__due-date">{vessel.readiness}%</span>
                <span className="mnt__due-label">prontidão</span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function ProviderProfile({ user }) {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    getProviderById(user.providerId).then(setProvider);
  }, [user]);

  if (!provider) {
    return <p>Carregando perfil...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Perfil profissional"
        title="Meu perfil profissional"
        subtitle="Como você aparece para os proprietários na rede de serviços."
        actions={
          <Link className="btn btn--primary" to={`/service-providers/${provider.id}`}>
            Ver página pública
          </Link>
        }
      />

      <section className="card card--padding">
        <div className="vessel-hero__main">
          <div className="provider-card__body">
            <div className="provider-card__title">
              {provider.name}{" "}
              {provider.isPartner && (
                <StatusBadge label="Parceiro SafeAnchor" tone="accent" />
              )}
            </div>
            <p className="provider-card__company">
              {provider.company} · {provider.role}
            </p>
            <p className="provider-card__role">{user?.email}</p>
            <div className="provider-card__meta">
              <span className="provider-card__role">
                {provider.experienceYears} anos de experiência
              </span>
              <StatusBadge label={provider.availability} tone={provider.availabilityTone} />
            </div>
            <p className="page-header__subtitle" style={{ margin: "10px 0 0" }}>
              {provider.bio}
            </p>
          </div>
          <Avatar
            initials={provider.initials}
            size={76}
            tone={provider.rating >= 4.8 ? "success" : "neutral"}
          />
        </div>
      </section>

      <div className="grid grid--3" style={{ marginTop: 18 }}>
        <StatCard
          label="Avaliação média"
          value={provider.rating.toFixed(1)}
          icon="star"
          tone="success"
          hint={`${provider.reviewsCount} avaliações`}
        />
        <StatCard
          label="Serviços realizados"
          value={provider.servicesDone}
          icon="check"
          tone="primary"
        />
        <StatCard label="Anos de experiência" value={provider.experienceYears} icon="wrench" tone="info" />
      </div>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Especialidades</h2>
          </div>
          <div className="tags">
            {provider.specialities.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MarinaProfile({ user }) {
  const [marina, setMarina] = useState(null);

  useEffect(() => {
    getMarinaById(user.marinaId).then(setMarina);
  }, [user]);

  if (!marina) {
    return <p>Carregando perfil...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Perfil da organização"
        title="Minha marina"
        subtitle={`${marina.name} · ${marina.location}`}
        actions={
          <Link className="btn btn--primary" to={`/marinas/${marina.id}`}>
            Ver página pública
          </Link>
        }
      />

      <section className="card card--padding">
        <div className="vessel-hero__main">
          <div className="provider-card__body">
            <div className="provider-card__title">{marina.name}</div>
            <p className="provider-card__role">
              <Icon name="locationPin" size={15} /> {marina.address}
            </p>
            <p className="provider-card__role" style={{ marginTop: 4 }}>
              {user?.email}
            </p>
            <p className="page-header__subtitle" style={{ margin: "10px 0 0" }}>
              {marina.description}
            </p>
          </div>
          <Avatar initials={user?.initials || "M"} size={76} tone="info" />
        </div>
      </section>

      <div className="grid grid--3" style={{ marginTop: 18 }}>
        <StatCard
          label="Ocupação"
          value={`${marina.occupancyPercent}%`}
          icon="boat"
          tone="warning"
          hint={`${marina.occupied} de ${marina.berths} vagas`}
        />
        <StatCard label="Vagas disponíveis" value={marina.availableBerths} icon="anchor" tone="primary" />
        <StatCard
          label="Prestadores parceiros"
          value={marina.partnerProviders.length}
          icon="users"
          tone="info"
        />
      </div>
    </div>
  );
}