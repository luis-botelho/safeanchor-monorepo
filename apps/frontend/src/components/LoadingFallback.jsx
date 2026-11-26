import { ListSkeleton } from "./PageSkeletons";

/**
 * Fallback único para telas secundárias que ainda não têm skeleton próprio.
 * Mantém o mesmo contrato de acessibilidade e o mesmo pulse das telas core.
 */
export default function LoadingFallback({ label = "Carregando dados" }) {
  return <ListSkeleton label={label} rows={4} />;
}
