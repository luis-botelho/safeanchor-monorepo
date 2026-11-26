import Icon from "./Icon";

/**
 * Estado de falha com explicação e saída. Não é um loading: precisa terminar
 * a espera com uma ação possível, nunca com um parágrafo solto.
 */
export default function ErrorState({
  title = "Não foi possível carregar",
  message,
  onRetry,
  retryLabel = "Tentar novamente",
}) {
  return (
    <div className="state-view state-view--error" role="alert">
      <span className="state-view__icon" aria-hidden="true">
        <Icon name="alert" size={24} />
      </span>
      <h3 className="state-view__title">{title}</h3>
      {message && <p className="state-view__description">{message}</p>}
      {onRetry && (
        <button
          className="btn btn--ghost btn--sm state-view__action"
          type="button"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
