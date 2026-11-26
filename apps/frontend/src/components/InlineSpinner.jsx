/**
 * Indicador de ação em andamento. O texto do botão já diz o que está acontecendo
 * ("Salvando...", "Entrando..."), então o spinner é apenas visual.
 */
export default function InlineSpinner() {
  return (
    <span className="inline-loader" aria-hidden="true">
      <span className="inline-loader__spin" />
    </span>
  );
}
