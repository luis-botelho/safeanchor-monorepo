import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader, { BackLink } from "../components/PageHeader";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import Rating from "../components/Rating";

import { getBoatRentalById, createRentalRequest } from "../services/boatRentalService";

const CHARTER_STEPS = [
  { id: "capitao", title: "Quem pilota", icon: "anchor" },
  { id: "servicos", title: "Serviços de bordo", icon: "users" },
  { id: "rota", title: "Rota / experiência", icon: "locationPin" },
  { id: "confirmar", title: "Confirmar pedido", icon: "check" },
];

export default function BoatRentalDetailPage() {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);

  const [captain, setCaptain] = useState("recomendado");
  const [services, setServices] = useState(["Chef"]);
  const [experience, setExperience] = useState("Família");
  const [route, setRoute] = useState("Ilha do Francês");

  useEffect(() => {
    getBoatRentalById(id).then(setRental);
  }, [id]);

  function toggleService(service) {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  }

  function handleConfirm() {
    createRentalRequest(rental.id, {
      captain,
      services,
      experience,
      route,
      status: "Solicitação enviada",
    });
    setSent(true);
  }

  if (!rental) {
    return <p>Carregando anúncio...</p>;
  }

  const current = CHARTER_STEPS[step];

  return (
    <div>
      <BackLink to="/boat-rentals" label="Voltar para boat rentals" />

      <PageHeader
        eyebrow="Montar charter"
        title={rental.vesselName}
        subtitle={`${rental.location} · ${rental.capacity} pessoas · capitão ${rental.captainIncluded ? "incluído" : "opcional"}`}
        actions={
          <>
            <Rating value={rental.rating} size={17} />
            <span className="badge badge--neutral">{rental.reviewsCount} avaliações</span>
          </>
        }
      />

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Sobre a embarcação</h2>
            </div>
            <p className="page-header__subtitle">{rental.description}</p>
            <div className="plan-stats">
              <div className="plan-stat">
                <strong>{rental.pricePerDay.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                <span>por dia</span>
              </div>
              <div className="plan-stat">
                <strong>{rental.capacity}</strong>
                <span>pessoas</span>
              </div>
              <div className="plan-stat">
                <strong>{rental.captainIncluded ? "Capitão" : "Autopiloto"}</strong>
                <span>incluso</span>
              </div>
            </div>
            <div className="tags" style={{ marginTop: 12 }}>
              {rental.amenities.map((a) => (
                <span className="tag" key={a}>{a}</span>
              ))}
            </div>
            <p className="mnt__meta" style={{ marginTop: 12 }}>
              Regras: {rental.rules.join(" · ")}
            </p>
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Montar charter</h2>
              <span className="wizard__position">Passo {step + 1} de {CHARTER_STEPS.length}</span>
            </div>

            <div className="charter-steps">
              {CHARTER_STEPS.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className={`charter-step ${index === step ? "charter-step--active" : ""} ${
                    index < step ? "charter-step--done" : ""
                  }`}
                  onClick={() => index < step && setStep(index) && index >= 0}
                >
                  <Icon name={item.icon} size={15} />
                  {item.title}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              {current.id === "capitao" && (
                <div className="stack">
                  {[
                    { value: "recomendado", label: "Capitão recomendado local", hint: "Avaliação 4.9 · responde em ~1h" },
                    { value: "armador", label: "O próprio armador", hint: "Experiencia pessoal da embarcação" },
                    { value: "outro", label: "Encontrar outro no ecossistema", hint: "Direciona para a lista de prestadores" },
                  ].map((opt) => (
                    <label
                      className={`select-card ${captain === opt.value ? "select-card--checked" : ""}`}
                      key={opt.value}
                    >
                      <input
                        type="radio"
                        name="captain"
                        value={opt.value}
                        checked={captain === opt.value}
                        onChange={() => setCaptain(opt.value)}
                      />
                      <span>
                        <strong className="select-card__title">{opt.label}</strong>
                        <span className="select-card__meta">{opt.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {current.id === "servicos" && (
                <div className="stack">
                  <p className="page-header__subtitle">
                    Adicione serviços a bordo — cada um entra no pedido e mantém a
                    equipe do ecossistema.
                  </p>
                  <div className="grid grid--2">
                    {rental.services.map((service) => (
                      <button
                        type="button"
                        key={service}
                        className={`select-card select-card--button ${services.includes(service) ? "select-card--checked" : ""}`}
                        onClick={() => toggleService(service)}
                      >
                        <span className="select-card__icon">
                          <Icon name={service === "Cap" || service === "Capitão" ? "anchor" : "users"} size={17} />
                        </span>
                        <span>
                          <strong className="select-card__title">{service}</strong>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current.id === "rota" && (
                <div className="stack">
                  <div className="field">
                    <label className="field__label" htmlFor="br-rota">Percurso / experiência</label>
                    <select id="br-rota" className="input" value={route} onChange={(e) => setRoute(e.target.value)}>
                      {rental.routeIdeas.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="tags">
                    {rental.experienceTypes.map((exp) => (
                      <button
                        type="button"
                        key={exp}
                        className={`tag ${experience === exp ? "tag--active" : ""}`}
                        onClick={() => setExperience(exp)}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                  <p className="page-header__subtitle">
                    Para famílias, recomendamos uma rota curta com fundeio tranquilo —
                    o SafeAnchor IA sugere o ajuste fino ao confirmar.
                  </p>
                </div>
              )}

              {current.id === "confirmar" && (
                <div className="stack">
                  <div className="ai-thread">
                    <strong>Resumo do pedido</strong>
                    <p>
                      {rental.vesselName} · {route} · {experience} · capitão: {captain} ·
                      serviços: {services.join(", ") || "nenhum"}
                    </p>
                  </div>
                  {sent ? (
                    <StatusBadge label="Solicitação enviada — aguardando confirmação do armador" tone="success" />
                  ) : (
                    <div className="form-actions">
                      <button className="btn btn--primary" type="button" onClick={handleConfirm}>
                        <Icon name="send" size={16} />
                        Enviar pedido de charter
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-actions" style={{ marginTop: 20 }}>
              <button
                className="btn btn--ghost"
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Voltar
              </button>
              {step < CHARTER_STEPS.length - 1 ? (
                <button className="btn btn--primary" type="button" onClick={() => setStep((s) => s + 1)}>
                  Continuar
                </button>
              ) : (
                <span />
              )}
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Proprietário</h2>
            </div>
            <div className="mnt">
              <span className="mnt__icon">
                <Icon name="user" size={18} />
              </span>
              <div>
                <p className="mnt__title">{rental.ownerLabel}</p>
                <p className="mnt__meta">
                  <span>Anunciante verificado · responde rápido</span>
                </p>
              </div>
            </div>
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Serviços relacionados</h2>
            </div>
            {rental.services.map((service) => (
              <div className="mnt" key={service}>
                <span className="mnt__icon">
                  <Icon name="users" size={17} />
                </span>
                <div>
                  <p className="mnt__title">{service}</p>
                  <p className="mnt__meta">Disponível para o período do charter</p>
                </div>
                <StatusBadge label="Solicitar" tone="accent" />
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}