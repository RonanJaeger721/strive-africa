export const siteUrl = "https://www.africastrive.com";

export const countries = ["Australia", "Bulgaria", "Canada", "France", "Georgia", "Germany", "Greece", "Hungary", "India", "Ireland", "Lithuania", "Malaysia", "Mauritius", "Poland", "Russia", "Spain", "UAE", "United Kingdom", "Uzbekistan"] as const;

export const destinationNotes: Record<string, { currency: string; summary: string }> = {
  Australia: { currency: "Australian dollar (AUD)", summary: "A globally recognised destination with broad course choice, established student services and multicultural cities." },
  Bulgaria: { currency: "Bulgarian lev (BGN)", summary: "A European destination offering university pathways in medicine, business, engineering and other professional fields." },
  Canada: { currency: "Canadian dollar (CAD)", summary: "A multicultural destination with university and college pathways across academic, technical and career-focused fields." },
  France: { currency: "Euro (EUR)", summary: "A major European education centre with routes in business, arts, engineering, science and hospitality." },
  Georgia: { currency: "Georgian lari (GEL)", summary: "A growing study destination known for internationally accessible university options, including medical pathways." },
  Germany: { currency: "Euro (EUR)", summary: "A respected European study destination with strong engineering, technology, research and applied-science pathways." },
  Greece: { currency: "Euro (EUR)", summary: "A Mediterranean study destination with a growing range of internationally taught academic programmes." },
  Hungary: { currency: "Hungarian forint (HUF)", summary: "A Central European destination with established universities and English-taught routes across several disciplines." },
  India: { currency: "Indian rupee (INR)", summary: "A large education market with extensive course choice across technology, business, health sciences and the humanities." },
  Ireland: { currency: "Euro (EUR)", summary: "An English-speaking European destination with strong links to technology, business, research and global employers." },
  Lithuania: { currency: "Euro (EUR)", summary: "A compact European destination with internationally oriented programmes and pathways in business and technology." },
  Malaysia: { currency: "Malaysian ringgit (MYR)", summary: "A diverse education hub with a wide choice of institutions, programme levels and comparatively accessible study routes." },
  Mauritius: { currency: "Mauritian rupee (MUR)", summary: "An island study destination offering a multicultural environment and a practical regional option for African students." },
  Poland: { currency: "Polish złoty (PLN)", summary: "A European study destination with English-taught options and a strong selection of business, technology and health programmes." },
  Russia: { currency: "Russian ruble (RUB)", summary: "A broad university market with medicine, engineering, technology and other academic routes across several cities." },
  Spain: { currency: "Euro (EUR)", summary: "A vibrant European destination offering programmes in business, hospitality, technology and other international fields." },
  UAE: { currency: "UAE dirham (AED)", summary: "A globally connected study environment with modern campuses and access to business, technology and professional networks." },
  "United Kingdom": { currency: "Pound sterling (GBP)", summary: "A well-established study destination offering globally recognised qualifications and a wide range of specialist programmes." },
  Uzbekistan: { currency: "Uzbekistani soʻm (UZS)", summary: "An emerging destination with affordable programme options, particularly within medicine and related fields." },
};

export const countrySlug = (country: string) => country.toLowerCase().replace(/\s+/g, "-");
export const countryFromSlug = (slug: string) => countries.find((country) => countrySlug(country) === slug);
