/**
 * Blocos de carregamento com geometria estável.
 *
 * Regras (docs/visual-system.md):
 * - as formas são decorativas e ficam fora da árvore de acessibilidade;
 * - o contêiner avisa leitores de tela com role="status" + aria-busy;
 * - o movimento é controlado só pelo CSS, sob prefers-reduced-motion.
 */

export function Skeleton({ width, height = 12, circle = false, className = "" }) {
  const style = { height: circle ? width || height : height };

  if (width) style.width = width;
  if (circle) style.borderRadius = "50%";

  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ widths = ["100%", "86%", "62%"], height = 10 }) {
  return (
    <div className="skeleton-text" aria-hidden="true">
      {widths.map((width, index) => (
        <Skeleton key={index} width={width} height={height} />
      ))}
    </div>
  );
}

export function SkeletonRegion({ label = "Carregando dados", children }) {
  return (
    <div className="skeleton-region" role="status" aria-busy="true">
      <span className="sr-only">{label}. Aguarde.</span>
      <div className="skeleton-region__content" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
