import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import EcosystemVisual from "../components/EcosystemVisual";
import Icon from "../components/Icon";

const layers = [
  {
    title: "Mapa (camada substituível)",
    desc: "Rota e POIs usam coordenadas demonstrativas. Um provider geográfico real pode trocar a camada sem alterar dados.",
    icon: "locationPin",
    to: "/trips/new",
  },
  {
    title: "IA (conceitual)",
    desc: "As respostas de IA são locais e demonstram o produto, sem chamadas externas.",
    icon: "star",
    to: "/profile",
  },
  {
    title: "Pagamentos (futuro)",
    desc: "Cotações e planos exibem valores, mas nenhuma transação real é executada.",
    icon: "shopping",
    to: "/marketplace",
  },
  {
    title: "Comunidade",
    desc: "Publicações, comentários, salvamentos e seguidores mostram o ciclo social do ecossistema.",
    icon: "message",
    to: "/community",
  },
];

const modules = [
  { to: "/fleet", icon: "fleet", label: "Frota", hint: "Embarcações e prontidão" },
  { to: "/trips", icon: "locationPin", label: "Viagens", hint: "Rotas e itinerário" },
  { to: "/service-requests/new", icon: "users", label: "Crew & serviços", hint: "Solicitar pessoas e serviço" },
  { to: "/marinas", icon: "anchor", label: "Marinas", hint: "Buscando atracacao" },
  { to: "/marketplace", icon: "shopping", label: "Marketplace", hint: "Serviços e anúncios" },
  { to: "/boat-rentals", icon: "boat", label: "Boat rentals", hint: "Aluguel de embarcação" },
  { to: "/jobs", icon: "wrench", label: "Jobs & crew", hint: "Oportunidades" },
  { to: "/provider/academy", icon: "doc", label: "Academy", hint: "Capacitação" },
  { to: "/community", icon: "message", label: "Comunidade", hint: "Troca e reputação" },
  { to: "/events", icon: "calendar", label: "Eventos", hint: "Vida náutica" },
];

export default function EcosystemPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Visão completa do produto"
        title="Ecossistema SafeAnchor"
        subtitle="Como frota, viagens, serviços, marinas e comunidade se conectam em um único ciclo."
      />

      <section className="card card--padding">
        <EcosystemVisual />
      </section>

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <div className="section-title">
          <h2>Ciclo do ecossistema</h2>
        </div>
        <ol className="cycle">
          <li>
            <strong>1 · Embarcação</strong>
            <span>Frota define autonomia e prontidão.</span>
          </li>
          <li>
            <strong>2 · Rota</strong>
            <span>Planejador gera rota, marinas e POIs.</span>
          </li>
          <li>
            <strong>3 · Tripulação</strong>
            <span>Necessidades viram solicitações e jobs.</span>
          </li>
          <li>
            <strong>4 · Marina conectada</strong>
            <span>Reserva, operação e serviços publicados.</span>
          </li>
          <li>
            <strong>5 · Marketplace</strong>
            <span>Prestadores e embarcações ganham visibilidade.</span>
          </li>
          <li>
            <strong>6 · Community</strong>
            <span>Experiências viram conteúdo e reputação.</span>
          </li>
        </ol>
      </section>

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <div className="section-title">
          <h2>Módulos navegáveis</h2>
        </div>
        <div className="grid grid--3">
          {modules.map((mod) => (
            <Link className="mini-link" to={mod.to} key={mod.to}>
              <Icon name={mod.icon} size={17} />
              <div>
                <strong>{mod.label}</strong>
                <span>{mod.hint}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <div className="section-title">
          <h2>Camadas transparentes</h2>
        </div>
        <div className="grid grid--2">
          {layers.map((layer) => (
            <Link className="ai-banner ai-banner--link" to={layer.to} key={layer.title}>
              <span className="ai-banner__icon"><Icon name={layer.icon} size={18} /></span>
              <div>
                <strong>{layer.title}</strong>
                <p>{layer.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}