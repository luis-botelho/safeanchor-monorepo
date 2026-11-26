import { Skeleton, SkeletonRegion, SkeletonText } from "./Skeleton";

/**
 * Skeletons por contexto de tela.
 *
 * Cada layout espelha a tela real (KPIs, cards, linhas de tabela), evitando o
 * "frame vazio" que não informa nada sobre o que está chegando.
 */

function HeaderSkeleton() {
  return (
    <header className="page-header">
      <div className="page-header__text">
        <Skeleton width={150} height={10} className="skeleton--label" />
        <Skeleton width={300} height={26} />
        <SkeletonText widths={["420px", "330px"]} height={10} />
      </div>
    </header>
  );
}

export function DashboardSkeleton() {
  return (
    <SkeletonRegion label="Carregando dashboard operacional">
      <HeaderSkeleton />

      <div className="grid grid--4 skeleton-section">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="stat-card skeleton-kpi" key={index}>
            <Skeleton width={40} height={40} circle />
            <div className="skeleton-kpi__body">
              <Skeleton width="64%" height={10} />
              <Skeleton width={56} height={26} />
              <Skeleton width="48%" height={9} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid--stack">
        <div className="card card--padding">
          <Skeleton width={190} height={16} />
          <div className="skeleton-rows">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="skeleton-row" key={index}>
                <Skeleton width={32} height={32} circle />
                <div className="skeleton-row__body">
                  <Skeleton width="58%" height={11} />
                  <Skeleton width="80%" height={9} />
                </div>
                <Skeleton width={64} height={20} className="skeleton--pill" />
              </div>
            ))}
          </div>
        </div>

        <div className="card card--padding">
          <Skeleton width={140} height={16} />
          <div className="skeleton-rows">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="skeleton-row" key={index}>
                <div className="skeleton-row__body">
                  <Skeleton width="76%" height={11} />
                  <Skeleton width="46%" height={9} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function VesselGridSkeleton({ count = 3 }) {
  return (
    <SkeletonRegion label="Carregando embarcações">
      <HeaderSkeleton />

      <div className="grid grid--3">
        {Array.from({ length: count }, (_, index) => (
          <div className="card skeleton-vessel" key={index}>
            <Skeleton height={148} className="skeleton-cover" />
            <div className="skeleton-vessel__body">
              <div className="skeleton-vessel__top">
                <Skeleton width={84} height={10} />
                <Skeleton width={52} height={52} circle />
              </div>
              <Skeleton width="72%" height={18} />
              <SkeletonText widths={["90%", "64%"]} height={9} />
              <Skeleton width={88} height={22} className="skeleton--pill" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function ListSkeleton({ label = "Carregando registros", rows = 5 }) {
  return (
    <SkeletonRegion label={label}>
      <HeaderSkeleton />

      <div className="card card--padding">
        <Skeleton width={190} height={16} />
        <div className="skeleton-rows">
          {Array.from({ length: rows }, (_, index) => (
            <div className="skeleton-row" key={index}>
              <Skeleton width={36} height={36} circle />
              <div className="skeleton-row__body">
                <Skeleton width="54%" height={11} />
                <Skeleton width="84%" height={9} />
              </div>
              <Skeleton width={72} height={20} className="skeleton--pill" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function TableSkeleton({ label = "Carregando tabela", rows = 5, columns = 4 }) {
  return (
    <SkeletonRegion label={label}>
      <HeaderSkeleton />

      <div className="card card--padding">
        <Skeleton width={170} height={16} />
        <div className="skeleton-table">
          <div className="skeleton-table__head">
            {Array.from({ length: columns }, (_, index) => (
              <Skeleton key={index} width={`${60 + (index % 3) * 12}%`} height={9} />
            ))}
          </div>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div className="skeleton-table__row" key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  width={`${52 + ((rowIndex + colIndex) % 4) * 11}%`}
                  height={10}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function DetailSkeleton({ label = "Carregando detalhes" }) {
  return (
    <SkeletonRegion label={label}>
      <HeaderSkeleton />

      <div className="card card--padding skeleton-detail__hero">
        <Skeleton width={72} height={72} circle />
        <div className="skeleton-detail__head">
          <Skeleton width="48%" height={22} />
          <SkeletonText widths={["70%", "52%"]} height={10} />
        </div>
        <Skeleton width={96} height={28} className="skeleton--pill" />
      </div>

      <div className="grid grid--2 skeleton-section">
        <div className="card card--padding">
          <Skeleton width={160} height={16} />
          <SkeletonText widths={["92%", "78%", "60%"]} height={10} />
        </div>
        <div className="card card--padding">
          <Skeleton width={140} height={16} />
          <SkeletonText widths={["86%", "68%", "74%"]} height={10} />
        </div>
      </div>
    </SkeletonRegion>
  );
}
