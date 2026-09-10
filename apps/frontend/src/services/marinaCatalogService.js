import { marinaCatalog } from "../mock/marinaCatalog";
import { publishListing } from "./marketplaceService";

const publishedCatalogIds = new Set(["cat-guarda", "cat-vaga-molhada", "cat-lavagem"]);

export async function getCatalog() {
  return marinaCatalog.map((service) => ({
    ...service,
    published: publishedCatalogIds.has(service.id),
  }));
}

export async function getPublishedCatalogCount() {
  return publishedCatalogIds.size;
}

export async function publishServiceToMarketplace(serviceId) {
  const service = marinaCatalog.find((item) => item.id === serviceId);

  if (!service || publishedCatalogIds.has(serviceId)) {
    return null;
  }

  publishedCatalogIds.add(serviceId);

  return publishListing({
    id: `mkp-mca-${serviceId}`,
    category: "Serviços",
    title: service.name,
    price: service.price,
    location: "Florianópolis, SC",
    sellerType: "MARINA",
    sellerId: "marin-costa-azul",
    seller: "Marina Costa Azul",
    condition: `Serviço · ${service.duration}`,
    imageSeed: "safeanchor-mkp-servico",
    description: `Serviço oferecido pela Marina Costa Azul: ${service.description}`,
  });
}