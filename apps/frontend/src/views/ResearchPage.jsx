import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../components/Icon";
import SubmitButton from "../components/SubmitButton";
import { STAGES } from "../mock/researchQuestions";
import {
  buildMailtoUrl,
  buildWhatsappUrl,
  hasWhatsappTarget,
  researchPhone,
} from "../services/researchService";
import {
  clearResearchConsent,
  markPrivacyNoticeSeen,
  readResearchConsent,
  saveResearchConsent,
} from "../services/researchConsent";
import useResearchViewModel from "../viewmodels/useResearchViewModel";

const EMPTY_CONTACT = { nome: "", contato: "", cidade: "", perfil: "" };

function ConsentGate({ onDecide }) {
  return (
    <div className="survey">
      <header className="survey__header">
        <Link to="/" className="survey__brand">
          <span className="survey__brand-mark">
            <Icon name="anchor" size={18} />
          </span>
          <span className="survey__brand-name">SafeAnchor</span>
        </Link>
        <span className="survey__stage">Antes de começar</span>
      </header>

      <main className="survey__shell">
        <div className="card consent-gate">
          <div className="card--padding">
            <span className="consent-gate__icon">
              <Icon name="doc" size={26} />
            </span>
            <h1 className="survey__question">
              Você autoriza a captura das respostas?
            </h1>
            <p className="survey__hint">
              Escolha com tranquilidade. Essa decisão vale para esta pesquisa e
              pode ser alterada na política de privacidade.
            </p>

            <div className="consent-gate__options">
              <button
                type="button"
                className="consent-gate__option consent-gate__option--accept"
                onClick={() => onDecide("accepted")}
              >
                <Icon name="check" size={18} />
                <span>
                  <strong>Aceitar captura</strong>
                  <small>
                    Envio as respostas ao SafeAnchor para análise da diretoria e
                    priorização do produto, incluindo contato se eu deixar.
                  </small>
                </span>
              </button>

              <button
                type="button"
                className="consent-gate__option"
                onClick={() => onDecide("declined")}
              >
                <Icon name="back" size={18} />
                <span>
                  <strong>Recusar captura</strong>
                  <small>
                    Posso responder normalmente, mas nada é enviado ao servidor.
                    O resumo fica apenas neste navegador para compartilhar
                    manualmente se eu quiser.
                  </small>
                </span>
              </button>
            </div>

            <p className="consent-gate__note">
              Não usamos cookies de rastreamento nem publicidade.{" "}
              <Link to="/privacidade">Leia a política de privacidade</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function OptionList({ question, answers, onSingle, onMulti }) {
  const selected = answers[question.id] || [];

  return (
    <div
      className="survey__options"
      role={question.type === "single" ? "radiogroup" : "group"}
      aria-label={question.question}
    >
      {question.options.map((option) => {
        const checked = selected.includes(option.value);
        const single = question.type === "single";

        return (
          <button
            key={option.value}
            type="button"
            className={`select-card survey__option${checked ? " select-card--checked" : ""}`}
            role={single ? "radio" : "checkbox"}
            aria-checked={checked}
            onClick={() => (single ? onSingle(option.value) : onMulti(option.value))}
          >
            {single ? (
              <span className="survey__radio" aria-hidden="true">
                {checked && <span className="survey__radio-dot" />}
              </span>
            ) : (
              <span className={`survey__check${checked ? " survey__check--on" : ""}`} aria-hidden="true">
                {checked && <Icon name="check" size={12} />}
              </span>
            )}

            {option.iconName && (
              <span className="select-card__icon">
                <Icon name={option.iconName} size={18} />
              </span>
            )}

            <span className="select-card__title">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ContactForm({ onSubmit, isSubmitting, submissionError }) {
  const [form, setForm] = useState(EMPTY_CONTACT);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.nome.trim()) {
      setError("Preencha seu nome.");
      return;
    }

    if (!form.contato.trim()) {
      setError("Preencha um e-mail ou WhatsApp para retorno.");
      return;
    }

    setError("");
    onSubmit(form);
  }

  return (
    <form className="survey__contact" onSubmit={handleSubmit}>
      <div className="field">
        <label className="field__label" htmlFor="research-nome">
          Como podemos te chamar?
        </label>
        <input
          id="research-nome"
          className="input"
          type="text"
          value={form.nome}
          onChange={(event) => update("nome", event.target.value)}
          placeholder="Seu nome"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="research-contato">
          E-mail ou WhatsApp
        </label>
        <input
          id="research-contato"
          className="input"
          type="text"
          value={form.contato}
          onChange={(event) => update("contato", event.target.value)}
          placeholder="voce@exemplo.com ou (11) 90000-0000"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="research-cidade">
          Cidade ou região <span className="survey__optional">(opcional)</span>
        </label>
        <input
          id="research-cidade"
          className="input"
          type="text"
          value={form.cidade}
          onChange={(event) => update("cidade", event.target.value)}
          placeholder="Ex.: Baixada Santista"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="research-perfil">
          Seu perfil <span className="survey__optional">(opcional)</span>
        </label>
        <input
          id="research-perfil"
          className="input"
          type="text"
          value={form.perfil}
          onChange={(event) => update("perfil", event.target.value)}
          placeholder="Ex.: proprietário de lancha"
        />
      </div>

      {(error || submissionError) && (
        <p className="field__error">{error || submissionError}</p>
      )}

      <SubmitButton
        busy={isSubmitting}
        idleLabel="Concluir e enviar"
        busyLabel="Enviando…"
        className="btn btn--accent btn--block"
      />
    </form>
  );
}

function Finished({ model, onRestart }) {
  const whatsapp = hasWhatsappTarget() ? buildWhatsappUrl(model.summary) : null;

  return (
    <div className="survey__done">
      <span className="survey__done-icon">
        <Icon name="check" size={26} />
      </span>

      <h2 className="survey__done-title">Obrigado pela resposta</h2>
      <p className="survey__done-text">
        {model.captured
          ? "Sua resposta foi registrada com sua autorização e ficou disponível para análise da diretoria. Você também pode conferir o resumo abaixo ou compartilhar uma cópia."
          : "Você recusou a captura: nada foi enviado ao servidor. O resumo ficou apenas neste navegador e você pode compartilhar uma cópia manualmente."}
      </p>

      <div className="survey__send">
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--block"
          >
            <Icon name="message" size={16} />
            Enviar por WhatsApp
          </a>
        )}

        <a href={buildMailtoUrl(model.summary)} className="btn btn--ghost btn--block">
          <Icon name="send" size={16} />
          Enviar por e-mail
        </a>

        <button type="button" className="btn btn--ghost btn--block" onClick={model.copy}>
          <Icon name="doc" size={16} />
          {model.copied ? "Resumo copiado" : "Copiar resumo"}
        </button>
      </div>

      <details className="survey__preview">
        <summary>Ver resumo das respostas</summary>
        <pre className="survey__preview-text">{model.summary}</pre>
      </details>

      <div className="survey__done-actions">
        <Link to="/" className="btn btn--ghost btn--sm">
          Voltar ao início
        </Link>
        <button type="button" className="btn btn--primary btn--sm" onClick={onRestart}>
          Responder de novo
        </button>
      </div>
    </div>
  );
}

function FinalStep({ model, consent }) {
  const captureAllowed = consent?.decision === "accepted";
  const consentHint = captureAllowed
    ? "Com sua autorização, a resposta será enviada ao servidor, analisada pela diretoria e encaminhada por e-mail usando o Resend."
    : "Você recusou a captura: nada será enviado ao servidor. O resumo fica só neste navegador e pode ser compartilhado manualmente.";

  if (!model.wantsContact) {
    return (
      <div className="survey__final">
        <span className="survey__done-icon">
          <Icon name="check" size={26} />
        </span>

        <h1 className="survey__question">Tudo pronto para finalizar</h1>
        <p className="survey__hint">
          Quer deixar um contato para conversarmos sobre o que você respondeu? É
          opcional e você pode finalizar sem isso.
        </p>

        <div className="survey__send">
          <button
            type="button"
            className="btn btn--accent btn--block"
            onClick={() => model.setWantsContact(true)}
          >
            <Icon name="message" size={16} />
            Quero deixar meu contato
          </button>
          {model.submissionError && (
            <p className="field__error" role="alert">{model.submissionError}</p>
          )}
          <SubmitButton
            type="button"
            busy={model.isSubmitting}
            idleLabel="Finalizar sem contato"
            busyLabel="Enviando…"
            className="btn btn--ghost btn--block"
            onClick={model.finish}
          />
        </div>

        <p className="survey__hint-inline survey__hint-inline--center">
          {consentHint}
        </p>
      </div>
    );
  }

  return (
    <div className="survey__final">
      <span className="survey__done-icon">
        <Icon name="user" size={24} />
      </span>

      <h1 className="survey__question">Deixe um contato para retorno</h1>
      <p className="survey__hint">{consentHint}</p>

      <ContactForm
        onSubmit={model.submit}
        isSubmitting={model.isSubmitting}
        submissionError={model.submissionError}
      />

      <button
        type="button"
        className="survey__footer-hint survey__footer-hint--button"
        onClick={() => {
          model.setWantsContact(false);
          model.finish();
        }}
      >
        Prefiro não deixar contato
      </button>
    </div>
  );
}

export default function ResearchPage() {
  const model = useResearchViewModel();
  const [consent, setConsent] = useState(() => readResearchConsent());

  function decideConsent(decision) {
    setConsent(saveResearchConsent(decision));
    markPrivacyNoticeSeen();
  }

  function changeConsent() {
    clearResearchConsent();
    setConsent(null);
  }

  const { current, index, total, isLast } = model;

  /* Reexecuta só quando a resposta da pergunta atual muda de fato. */
  const answerKey = current
    ? JSON.stringify([
        model.answers[current.id] || null,
        model.answers[`${current.id}__other`] || null,
      ])
    : "";

  useEffect(() => {
    if (!consent) return;
    if (!current || current.type !== "single" || current.hasOther) return;
    if (!model.answered(current) || !model.canContinue) return;

    const timer = setTimeout(model.goNext, 300);
    return () => clearTimeout(timer);
  }, [answerKey, consent]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!consent) {
    return <ConsentGate onDecide={decideConsent} />;
  }

  if (model.finished) {
    return (
      <div className="survey">
        <div className="survey__shell">
          <Finished model={model} onRestart={model.restart} />
        </div>
      </div>
    );
  }

  const isMulti = current.type === "multi";
  const isText = current.type === "text";
  const hasOther = model.needsOther;

  if (model.atFinalStep) {
    return (
      <div className="survey">
        <header className="survey__header">
          <Link to="/" className="survey__brand">
            <span className="survey__brand-mark">
              <Icon name="anchor" size={18} />
            </span>
            <span className="survey__brand-name">SafeAnchor</span>
          </Link>
          <span className="survey__stage">{STAGES.fim}</span>
        </header>

        <div
          className="survey__progress"
          role="progressbar"
          aria-valuenow={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso da pesquisa"
        >
          <span className="survey__progress-bar" style={{ width: "100%" }} />
        </div>

        <main className="survey__shell">
          <div className="card survey__card">
            <div className="card--padding">
              <FinalStep model={model} consent={consent} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="survey">
      <header className="survey__header">
        <Link to="/" className="survey__brand">
          <span className="survey__brand-mark">
            <Icon name="anchor" size={18} />
          </span>
          <span className="survey__brand-name">SafeAnchor</span>
        </Link>
        <span className="survey__stage">{STAGES[current.stage]}</span>
      </header>

      <div
        className="survey__progress"
        role="progressbar"
        aria-valuenow={model.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da pesquisa"
      >
        <span className="survey__progress-bar" style={{ width: `${model.progress}%` }} />
      </div>

      <main className="survey__shell">
        <p className="survey__counter">
          Pergunta {index + 1} de {total}
        </p>

        <div className="card survey__card">
          <div className="card--padding">
            <h1 className="survey__question">{current.question}</h1>
            {current.hint && <p className="survey__hint">{current.hint}</p>}

            {isMulti && (
              <OptionList
                question={current}
                answers={model.answers}
                onMulti={model.toggleMulti}
              />
            )}

            {current.options && !isMulti && (
              <OptionList
                question={current}
                answers={model.answers}
                onSingle={model.selectSingle}
              />
            )}

            {isText && (
              <div className="survey__text">
                <label className="field__label" htmlFor="research-text">
                  Sua resposta
                </label>
                <textarea
                  id="research-text"
                  className="textarea"
                  value={model.answers[current.id] || ""}
                  onChange={(event) => model.setText(event.target.value)}
                  placeholder={current.placeholder}
                />
              </div>
            )}

            {hasOther && (
              <div className="survey__text">
                <label className="field__label" htmlFor="research-other">
                  Conte em poucas palavras
                </label>
                <input
                  id="research-other"
                  className="input"
                  type="text"
                  value={model.otherValue}
                  onChange={(event) => model.setOther(event.target.value)}
                  placeholder="Escreva aqui"
                />
              </div>
            )}
          </div>
        </div>

        <div className="survey__nav">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={model.goBack}
            disabled={model.index === 0}
          >
            <Icon name="back" size={16} />
            Voltar
          </button>

          {!isMulti && !isText && index === 0 && (
            <span className="survey__hint-inline">Escolha uma opção para seguir</span>
          )}

          {index > 0 && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={model.skip}
            >
              Pular
            </button>
          )}

          <button
            type="button"
            className="btn btn--primary"
            onClick={model.goNext}
            disabled={!model.canContinue && !isText}
          >
            {isLast ? "Finalizar" : "Continuar"}
          </button>
        </div>
      </main>

      <footer className="survey__footer">
        <p className="survey__footer-note">
          {consent.decision === "accepted"
            ? "Captura autorizada: ao finalizar, a resposta é enviada ao SafeAnchor e analisada pela diretoria."
            : "Captura recusada: ao finalizar, nada é enviado ao servidor; o resumo fica só neste navegador."}{" "}
          <button
            type="button"
            className="survey__footer-hint survey__footer-hint--button"
            onClick={changeConsent}
          >
            Alterar escolha
          </button>
          {" · "}
          <Link to="/privacidade">Política de Privacidade e LGPD</Link>
        </p>
      </footer>

      <p className="survey__dev-note">
        <Icon name="alert" size={14} />
        Ambiente de demonstração. Destino configurado:{" "}
        {hasWhatsappTarget() ? `WhatsApp ${researchPhone}` : "apenas e-mail"}.
      </p>
    </div>
  );
}
