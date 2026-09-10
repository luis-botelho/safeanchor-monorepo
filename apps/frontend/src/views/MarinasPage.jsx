import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMarinas } from "../services/marinaService";
import PageHeader from "../components/PageHeader";
import CoverImage from "../components/CoverImage";
import Rating from "../components/Rating";
import Icon from "../components/Icon";

function parseFloatSafe(value) {
  return value ?? 0;
}

export default function MarinasPage() {
  const [marinas, setMarinas] = useState([]);

  useEffect(() => {
    getMarinas().then(setMarinas);
  }, []);

  if (marinas.length === 0) {
    return <p>Carregando marinas...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Onde atracar"
        title="Marinas"
        subtitle="Explore marinas e clubes náuticos da região, com estrutura, serviços e prestadores parceiros."
      />

      <div className="grid grid--3">
        {marinas.map((marina) => {
          const occupancy = Math.round(
            (parseFloatSafe(marina.occupied) / parseFloatSafe(marina.berths)) * 100,
          );

          return (
            <Link className="card marina-card" to={`/marinas/${marina.id}`} key={marina.id}>
              <CoverImage
                seed={marina.imageSeed}
                hint={marina.name}
                className="marina-card__cover"
              />
              <div className="marina-card__body">
                <h3 className="marina-card__title">{marina.name}</h3>
                <p className="marina-card__location">
                  <Icon name="locationPin" size={15} />
                  {marina.location}
                </p>
                <Rating value={marina.rating} size={15} />
                <span className="marina-card__location">
                  {" "}
                  · {marina.reviewsCount} avaliações
                </span>
                <div className="berth-info">
                  <span>{marina.structure.length} comodidades</span>
                  <span>{marina.services.length} serviços</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div className="berth-bar">
                    <div className="berth-bar__fill" style={{ width: `${occupancy}%` }} />
                  </div>
                  <div className="berth-info">
                    <span>{occupancy}% ocupados</span>
                    <span>{marina.berths} vagas totais</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}