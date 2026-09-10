import { listings, marketplaceCategories } from "../mock/marketplace";

const publishedListings = [];

const allListings = () => [...publishedListings, ...listings];

export async function getListings(category = "Todas") {
  if (category === "Todas") {
    return allListings();
  }

  return allListings().filter((item) => item.category === category);
}

export async function getListingById(id) {
  return allListings().find((item) => item.id === id) || null;
}

export function publishListing(listing) {
  publishedListings.unshift(listing);
  return listing;
}

export function getMarketplaceCategories() {
  return marketplaceCategories;
}