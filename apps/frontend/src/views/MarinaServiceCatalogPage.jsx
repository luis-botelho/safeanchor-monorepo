import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMarinaById } from "../services/marinaService";
import {
  getCatalog,
  publishServiceToMarketplace,
} from "../services/marinaCatalogService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

export default function MarinaServiceCatalogPage() {
  const { user } = useAuth();
  const marinaId = user?.marinaId || "marin-costa-azul";

  const [marina, setMarina] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [justPublished, setJustPublished] = useState(null);

  useEffect(() => {
    async function load() {
      setMarina(await getMarinaById(marinaId));
      setCatalog(await getCatalog());
    }

    load();
  }, [marinaId]);

  if (!marina) {
    return <p>Carregando catálogo...</p>;
  }

  async function handlePublish(service) {
    const listing = await publishServiceToMarketplace(service.id);
    setCatalog(await getCatalog());

    if (listing) {
      setJustPublished(service.name);
      window.setTimeout(() => setJustPublished(null), 4000);
    }
  }

  const publishedCount = catalog.filter((service) => service.published).length;

  return (
    <div>
      <PageHeader
        eyebrow={`${marina.name} · Operação`}
        title="Catálogo de serviços"
        subtitle="Serviços que a marina oferece aos proprietários. Publique um item para que ele apareça no Marketplace."
        actions={
          <>
            <Link className="btn btn--ghost" to="/marina/services">
              Operação
            </Link>
            <Link className="btn btn--primary" to="/marketplace">
              Ver Marketplace
            </Link>
          </>
        }
      />

      {justPublished && (
        <p className="demo-banner">
          <strong>Serviço publicado!</strong>
          <span>
            "{justPublished}" já aparece no Marketplace como um anúncio da Marina
            Costa Azul. Abra o Marketplace para conferir.
          </span>
        </p>
      )}

      <section className="card card--padding" style={{ marginBottom: 18 }}>
        <div className="provider-card__stats">
          <span>
            {publishedCount} de {catalog.length} serviços publicados
          </span>
          <span>·</span>
          <span>Marketplace compartilhado entre Proprietário · Prestador · Marina</span>
        </div>
      </section>

      <div className="grid grid--3">
        {catalog.map((service) => (
          <article className="card catalog-card" key={service.id}>
            <div className="catalog-card__header">
              <span className="tag">{service.category}</span>
              {service.published ? (
                <StatusBadge label="Publicado" tone="success" />
              ) : (
                <StatusBadge label="Não publicado" tone="neutral" />
              )}
            </div>
            <h3 className="catalog-card__title">{service.name}</h3>
            <p className="catalog-card__price">{service.price}</p>
            <p className="listing-card__meta">
              {service.duration} · {service.availability}
            </p>
            <p className="page-header__subtitle" style={{ margin: "8px 0 0" }}>
              {service.description}
            </p>
            <div className="catalog-card__footer">
              <StatusBadge label={service.status} tone={service.statusTone} />
              {service.published ? (
                <span className="catalog-card__done">
                  <Icon name="check" size={15} /> No Marketplace
                </span>
              ) : (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => handlePublish(service)}
                >
                  <Icon name="plus" size={15} />
                  Publicar
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}