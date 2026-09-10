import { providers, providerSpecialities } from "../mock/providers";

export async function getProviders() {
  return providers;
}

export async function getProviderById(id) {
  return providers.find((provider) => provider.id === id) || null;
}

export async function filterProviders({ speciality, location, minRating } = {}) {
  let result = providers;

  if (speciality && speciality !== "Todas") {
    result = result.filter((provider) =>
      provider.specialities.some((item) =>
        item.toLowerCase().includes(speciality.toLowerCase()),
      ),
    );
  }

  if (location && location !== "Todos") {
    result = result.filter((provider) =>
      provider.area.toLowerCase().includes(location.toLowerCase()),
    );
  }

  if (minRating) {
    result = result.filter((provider) => provider.rating >= minRating);
  }

  return result;
}

export function getSpecialities() {
  return providerSpecialities;
}

export function getSuggestedProviders(category) {
  if (!category) {
    return providers.slice(0, 3);
  }

  const keywordMap = {
    Motor: ["Motores", "borrachas", "injeção"],
    Elétrica: ["Elétrica", "eletrônica"],
    Casco: ["Casco", "Pintura"],
    "Limpeza / mergulho": ["Mergulho"],
    "Inspeção de segurança": ["Inspeção"],
  };

  const keywords = keywordMap[category] || [];

  const matched = providers.filter((provider) =>
    keywords.some((keyword) =>
      provider.specialities.some((speciality) =>
        speciality.toLowerCase().includes(keyword.toLowerCase()),
      ),
    ),
  );

  if (matched.length >= 2) {
    return matched;
  }

  return providers.slice(0, 3);
}