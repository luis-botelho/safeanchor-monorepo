// Representação visual do ecossistema SafeAnchor: os cinco módulos se
// conectam ao centro "Ecossistema" e cada um alimenta o próximo ciclo.

import Icon from "./Icon";

const nodes = [
  { id: "fleet", label: "Frota", icon: "fleet", desc: "Embarcações e manutenção" },
  { id: "trips", label: "Viagens", icon: "locationPin", desc: "Planejamento e rota" },
  { id: "crew", label: "Crew", icon: "users", desc: "Tripulação e serviços" },
  { id: "marina", label: "Marina", icon: "anchor", desc: "Estrutura e operação" },
  { id: "academy", label: "Academy", icon: "doc", desc: "Capacitação continua" },
  { id: "community", label: "Comunidade", icon: "message", desc: "Troca e reputação" },
];

export default function EcosystemVisual({ compact = false }) {
  return (
    <div className={`eco ${compact ? "eco--compact" : ""}`}>
      <div className="eco__hub">
        <span className="eco__hub-icon">
          <Icon name="fleet" size={22} />
        </span>
        <strong>Ecossistema SafeAnchor</strong>
        <span className="eco__hub-sub">um ciclo: planear · navegar · contratar · aprender</span>
      </div>

      {!compact && (
        <p className="eco__intro">
          Cada módulo alimenta o próximo: a embarcação escolhida define a rota,
          a rota demanda tripulação e serviços, a marina acolhe a operação, e a
          experiência vira aprendizado e conteúdo para a comunidade — que
          inspira a próxima viagem.
        </p>
      )}

      <div className={compact ? "eco__grid eco__grid--compact" : "eco__grid"}>
        {nodes.map((node) => (
          <div className="eco__node" key={node.id}>
            <span className="eco__node-icon">
              <Icon name={node.icon} size={18} />
            </span>
            <strong>{node.label}</strong>
            <span className="eco__node-desc">{node.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}