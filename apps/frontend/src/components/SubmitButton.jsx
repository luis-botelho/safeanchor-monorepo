import InlineSpinner from "./InlineSpinner";

/**
 * Botão de ação assíncrona.
 *
 * Centraliza o contrato de loading de `docs/visual-system.md`:
 * - `disabled` e `aria-busy` enquanto a ação corre (sem duplo clique);
 * - spinner inline + rótulo de estado;
 * - os dois rótulos ocupam a mesma célula do grid, então a largura não dança.
 *
 * O texto de estado é lido pelo leitor de tela; o spinner é decorativo.
 */
export default function SubmitButton({
  busy = false,
  idleLabel,
  busyLabel,
  className = "btn btn--primary",
  type = "submit",
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      onClick={onClick}
    >
      {children}
      <span className="btn__label">
        <span className="btn__label-idle" aria-hidden={busy || undefined}>
          {idleLabel}
        </span>
        <span className="btn__label-busy" aria-hidden={!busy || undefined}>
          {busyLabel}
        </span>
      </span>
      {busy && <InlineSpinner />}
    </button>
  );
}
