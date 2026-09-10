import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getListings, getMarketplaceCategories } from "../services/marketplaceService";
import PageHeader from "../components/PageHeader";
import CoverImage from "../components/CoverImage";
import Icon from "../components/Icon";

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("Todas");

  useEffect(() => {
    setCategories(getMarketplaceCategories());
  }, []);

  useEffect(() => {
    getListings(category).then(setListings);
  }, [category]);

  function sellerInfo(listing) {
    if (listing.sellerType === "MARINA") {
      return listing.sellerId
        ? { label: "Marina", to: `/marinas/${listing.sellerId}` }
        : { label: "Marina", to: null };
    }

    if (listing.sellerType === "SERVICE_PROVIDER") {
      return listing.sellerId
        ? { label: "Prestador", to: `/service-providers/${listing.sellerId}` }
        : { label: "Prestador", to: null };
    }

    return { label: "Proprietário", to: null };
  }

  return (
    <div>
      <PageHeader
        eyebrow="Marketplace náutico"
        title="Marketplace"
        subtitle="Embarcações, motores, peças, equipamentos e serviços anunciados pela comunidade."
        actions={
          <button
            className="btn btn--ghost"
            onClick={() => {
              window.alert("Publicação de anúncios chega em breve nesta demonstração.");
            }}
          >
            <Icon name="plus" size={17} />
            Publicar anúncio
          </button>
        }
      />

      <section className="card card--padding" style={{ marginBottom: 16 }}>
        <div className="mnt">
          <span className="mnt__icon">
            <Icon name="users" size={18} />
          </span>
          <div>
            <p className="mnt__title">O ecossistema não para aqui</p>
            <p className="mnt__meta">
              <span>
                Vagas de tripulação e serviços aparecem em{" "}
                <Link className="inline-link" to="/jobs">Jobs & Crew</Link> · aluguel
                de embarcações em{" "}
                <Link className="inline-link" to="/boat-rentals">Boat Rentals</Link> · a
                visão completa em{" "}
                <Link className="inline-link" to="/ecosystem">Ecossistema</Link>.
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="filters">
        <div className="field">
          <label className="field__label" htmlFor="market-category">
            Categoria
          </label>
          <select
            id="market-category"
            className="select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {["Todas", ...categories].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {listings.length === 0 ? (
        <section className="card">
          <div className="card--padding">
            <p className="page-header__subtitle">Nenhum anúncio nesta categoria.</p>
          </div>
        </section>
      ) : (
        <div className="grid grid--4">
          {listings.map((listing) => {
            const seller = sellerInfo(listing);

            return (
              <article className="card listing-card" key={listing.id}>
                <CoverImage
                  seed={listing.imageSeed}
                  hint={listing.title}
                  className="listing-card__cover"
                />
                <div className="listing-card__body">
                  <p className="listing-card__category">{listing.category}</p>
                  <h3 className="listing-card__title">{listing.title}</h3>
                  <p className="listing-card__price">{listing.price}</p>
                  <p className="listing-card__meta">
                    {listing.condition} · {listing.location}
                  </p>
                  <p className="listing-card__seller">
                    <span className="seller-badge" data-type={seller.label}>
                    {seller.label}
                  </span>
                    {seller.to ? (
                      <Link
                        to={seller.to}
                        className="listing-card__seller-link"
                        title="Ver perfil do vendedor"
                      >
                        {listing.seller}
                      </Link>
                    ) : (
                      <span>{listing.seller}</span>
                    )}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}