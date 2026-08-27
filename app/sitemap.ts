import type { MetadataRoute } from "next";
import { countries, countrySlug, siteUrl } from "./data/destinations";
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    ...countries.map((country) => ({ url: `${siteUrl}/study-in/${countrySlug(country)}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
