import { Link } from "react-router-dom";

import Icon from "../components/Icon";

const choices = [
  {
    to: "/pesquisa",
    icon: "message",
    title: "Responder a pesquisa",
    description:
      "Conte como você cuida do seu barco hoje. São poucas perguntas e ajuda a gente a decidir o que construir primeiro.",
    action: "Começar a pesquisa",
    meta: "Leva de 3 a 5 minutos",
    featured: true,
  },
  {
    to: "/login",
    icon: "dashboard",
    title: "Ver a demonstração",
    description:
      "Conheça o SafeAnchor funcionando com dados de exemplo: frota, manutenção, orçamento e prestadores.",
    action: "Entrar na demo",
    meta: "Não precisa criar conta",
    featured: false,
  },
];

export default function Intro() {
  return (
    <div className="welcome">
      <div className="welcome__glow" aria-hidden="true" />

      <header className="welcome__header">
        <Link to="/" className="welcome__brand">
          <span className="welcome__brand-mark">
            <Icon name="anchor" size={20} />
          </span>
          <span className="welcome__brand-name">SafeAnchor</span>
        </Link>
        <Link to="/login" className="btn btn--ghost btn--sm">
          Já tenho conta
        </Link>
      </header>

      <main className="welcome__main">
        <p className="welcome__eyebrow">Estamos construindo o SafeAnchor</p>
        <h1 className="welcome__title">
          Ajude a melhorar a gestão náutica
          <span className="welcome__title-accent"> para quem vive o mar</span>
        </h1>
        <p className="welcome__lead">
          Antes de decidir o que entra no produto, queremos ouvir quem usa barco,
          marina e serviço todo dia. Escolha por onde começar:
        </p>

        <ul className="welcome__choices">
          {choices.map((choice) => (
            <li
              key={choice.to}
              className={`welcome__choice${choice.featured ? " welcome__choice--featured" : ""}`}
            >
              <span className="welcome__choice-icon">
                <Icon name={choice.icon} size={22} />
              </span>

              <h2 className="welcome__choice-title">{choice.title}</h2>
              <p className="welcome__choice-text">{choice.description}</p>

              <Link
                to={choice.to}
                className={`btn btn--block ${choice.featured ? "btn--accent" : "btn--primary"}`}
              >
                {choice.action}
              </Link>

              <span className="welcome__choice-meta">
                <Icon name="check" size={14} />
                {choice.meta}
              </span>
            </li>
          ))}
        </ul>
      </main>

      <footer className="welcome__footer">
        <p className="welcome__footer-note">
          <Icon name="check" size={15} />
          Sem resposta certa ou errada. Você pode pular qualquer pergunta e deixar seu
          contato de lado.
        </p>
      </footer>
    </div>
  );
}