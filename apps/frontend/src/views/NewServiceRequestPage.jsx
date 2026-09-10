import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFleetVessels } from "../services/vesselService";
import { getSuggestedProviders } from "../services/providerService";
import { getMarinas } from "../services/marinaService";
import { createRequest } from "../services/requestService";
import PageHeader, { BackLink } from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import Rating from "../components/Rating";
import Icon from "../components/Icon";

const serviceCategories = [
  "Manutenção do motor",
  "Elétrica / eletrônica",
  "Casco & pintura",
  "Limpeza / mergulho",
  "Inspeção de segurança",
  "Outro",
];

export default function NewServiceRequestPage() {
  const [step, setStep] = useState(1);
  const [vessels, setVessels] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [marinas, setMarinas] = useState([]);

  const [vesselId, setVesselId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [providerId, setProviderId] = useState("");
  const [marinaId, setMarinaId] = useState("");

  const steps = ["Embarcação", "Serviço", "Descrição", "Prestador / Marina"];

  useEffect(() => {
    getFleetVessels().then(setVessels);
  }, []);

  useEffect(() => {
    getMarinas().then(setMarinas);
  }, []);

  useEffect(() => {
    if (category) {
      getSuggestedProviders(category).then(setSuggested);
    }
  }, [category]);

  function next() {
    setStep((value) => value + 1);
  }

  function back() {
    setStep((value) => Math.max(1, value - 1));
  }

  function canNext() {
    if (step === 1) return Boolean(vesselId);
    if (step === 2) return Boolean(category);
    if (step === 3) return description.trim().length >= 5;
    if (step === 4) return Boolean(providerId) || Boolean(marinaId);
    return true;
  }

  function chooseProvider(id) {
    setProviderId(id);
    setMarinaId("");
  }

  function chooseMarina(id) {
    setMarinaId(id);
    setProviderId("");
  }

  async function submit() {
    await createRequest({
      vesselId,
      category,
      description,
      providerId,
      targetType: marinaId ? "MARINA" : undefined,
      targetId: marinaId || undefined,
    });

    setStep(5);
  }

  const selectedProvider = suggested.find((item) => item.id === providerId);
  const selectedMarina = marinas.find((item) => item.id === marinaId);

  return (
    <div>
      <BackLink to="/service-requests" label="Voltar para solicitações" />

      <PageHeader
        eyebrow="Rede de serviços"
        title="Nova solicitação"
        subtitle="Descreva o que sua embarcação precisa para um prestador avaliado ou para a operação da marina."
      />

      {step <= 4 && (
        <div className="steps">
          {steps.map((label, index) => (
            <span
              className={`steps__item ${
                index + 1 === step
                  ? "steps__item--active"
                  : index + 1 < step
                    ? "steps__item--done"
                    : ""
              }`}
              key={label}
              title={label}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <section className="card card--padding">
          <div className="form-card__title">Qual embarcação precisa de serviço?</div>
          <div className="grid grid--2">
            {vessels.map((vessel) => (
              <button
                key={vessel.id}
                type="button"
                className="demo-chip"
                onClick={() => setVesselId(vessel.id)}
                style={{
                  borderColor: vesselId === vessel.id ? "var(--primary)" : undefined,
                  background: vesselId === vessel.id ? "var(--success-bg)" : undefined,
                }}
              >
                <Icon name="boat" size={17} />
                <span>
                  <strong>{vessel.name}</strong> — {vessel.type} · {vessel.length} ({vessel.readiness}% prontidão)
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="card card--padding">
          <div className="form-card__title">Que tipo de serviço você precisa?</div>
          <div className="grid grid--2">
            {serviceCategories.map((item) => (
              <button
                key={item}
                type="button"
                className="demo-chip"
                onClick={() => setCategory(item)}
                style={{
                  borderColor: category === item ? "var(--primary)" : undefined,
                  background: category === item ? "var(--success-bg)" : undefined,
                }}
              >
                <Icon name="wrench" size={17} />
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="card card--padding">
          <div className="form-card__title">Descreva o que precisa ser feito</div>
          <div className="field">
            <label className="field__label" htmlFor="request-description">
              Detalhes do serviço
            </label>
            <textarea
              id="request-description"
              className="textarea"
              placeholder="Ex.: O motor apresenta falha de partida quando aquecido. Peço diagnóstico e orçamento."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <span className="field__hint">
              Quanto mais detalhes, melhor o prestador consegue se preparar.
            </span>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="card card--padding">
          <div className="form-card__title">Escolha um prestador recomendado</div>
          <div className="stack">
            {suggested.map((provider) => (
              <button
                key={provider.id}
                type="button"
                className="mnt"
                style={{
                  textAlign: "left",
                  background: "transparent",
                  border: "1px solid rgba(32,35,33,.08)",
                  borderRadius: 12,
                  width: "100%",
                  alignItems: "center",
                }}
                onClick={() => chooseProvider(provider.id)}
              >
                <Avatar
                  initials={provider.initials}
                  size={42}
                  tone={provider.rating >= 4.8 ? "success" : "neutral"}
                />
                <span style={{ display: "block" }}>
                  <span className="mnt__title">
                    {provider.name}
                    {provider.isPartner && (
                      <span style={{ marginLeft: 8 }}>
                        <StatusBadge label="Parceiro" tone="accent" />
                      </span>
                    )}
                  </span>
                  <span className="mnt__meta">
                    <span>{provider.company}</span> ·{" "}
                    <Rating value={provider.rating} size={13} />
                  </span>
                </span>
                <span
                  style={{
                    justifySelf: "end",
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid rgba(32,35,33,.2)",
                    background:
                      providerId === provider.id ? "var(--primary)" : "transparent",
                    color: "#fff",
                  }}
                >
                  {providerId === provider.id && <Icon name="check" size={14} />}
                </span>
              </button>
            ))}
          </div>
          {selectedProvider ? (
            <p className="page-header__subtitle" style={{ marginTop: 14 }}>
              <strong>{selectedProvider.name}</strong> está{" "}
              {selectedProvider.availability.toLowerCase()} e responde em{" "}
              {selectedProvider.responsesTime}.
            </p>
          ) : (
            selectedMarina && (
              <p className="page-header__subtitle" style={{ marginTop: 14 }}>
                <strong>{selectedMarina.name}</strong> está com{" "}
                {selectedMarina.berths - selectedMarina.occupied} vagas livres e recebe sua
                solicitação diretamente para a operação da marina.
              </p>
            )
          )}

          <div className="form-card__title" style={{ marginTop: 22 }}>
            ou solicite direto à marina
          </div>
          <div className="stack">
            {marinas.map((marina) => (
              <button
                key={marina.id}
                type="button"
                className="mnt"
                style={{
                  textAlign: "left",
                  background: "transparent",
                  border: "1px solid rgba(32,35,33,.08)",
                  borderRadius: 12,
                  width: "100%",
                  alignItems: "center",
                }}
                onClick={() => chooseMarina(marina.id)}
              >
                <Avatar initials={marina.name.slice(0, 2)} size={42} tone="info" />
                <span style={{ display: "block" }}>
                  <span className="mnt__title">
                    {marina.name}
                    {marina.id === "marin-costa-azul" && (
                      <span style={{ marginLeft: 8 }}>
                        <StatusBadge label="Recomendada" tone="accent" />
                      </span>
                    )}
                  </span>
                  <span className="mnt__meta">
                    <span>{marina.location}</span> ·{" "}
                    <span>{marina.berths - marina.occupied} vagas livres</span> ·{" "}
                    <Rating value={marina.rating} size={13} />
                  </span>
                </span>
                <span
                  style={{
                    justifySelf: "end",
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid rgba(32,35,33,.2)",
                    background: marinaId === marina.id ? "var(--primary)" : "transparent",
                    color: "#fff",
                  }}
                >
                  {marinaId === marina.id && <Icon name="check" size={14} />}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="card">
          <div className="success-panel">
            <span className="success-panel__icon">
              <Icon name="check" size={30} />
            </span>
            <h2 className="success-panel__title">Solicitação enviada!</h2>
            <p className="success-panel__text">
              {marinaId
                ? "A marina recebeu seu pedido e vai designar a equipe ou um prestador parceiro. Acompanhe o status em Solicitações."
                : "O prestador recebeu seu pedido e deve responder com um orçamento em breve. Você pode acompanhar o status em Solicitações."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link className="btn btn--primary" to="/service-requests">
                Ver solicitações
              </Link>
              <Link className="btn btn--ghost" to="/service-providers">
                Explorar outros prestadores
              </Link>
            </div>
          </div>
        </section>
      )}

      {step < 5 && (
        <div className="form-actions">
          {step > 1 && (
            <button className="btn btn--ghost" onClick={back}>
              Voltar
            </button>
          )}
          {step < 4 ? (
            <button className="btn btn--primary" onClick={next} disabled={!canNext()}>
              Continuar
            </button>
          ) : (
            <button className="btn btn--primary" onClick={submit} disabled={!canNext()}>
              Enviar solicitação
            </button>
          )}
        </div>
      )}
    </div>
  );
}