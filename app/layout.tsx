import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://strive-africa.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Study Abroad Consultants in Zimbabwe | Strive Africa",
  description: "Study abroad guidance from Harare for university placements, international applications, career guidance, student visa support and flight bookings.",
  keywords: ["study abroad Zimbabwe", "study abroad consultants Zimbabwe", "study abroad consultants Harare", "education consultants Zimbabwe", "education consultants Harare", "university placement agency Zimbabwe", "international university applications Zimbabwe", "student visa assistance Zimbabwe", "study abroad programmes and fees", "study in Malaysia from Zimbabwe", "study in Poland from Zimbabwe", "study in the UK from Zimbabwe", "study in Canada from Zimbabwe"],
  alternates: { canonical: "/" },
  icons: { icon: "/strive-logo.jpeg" },
  openGraph: { type: "website", url: siteUrl, siteName: "Strive Africa", title: "Study Abroad Consultants in Zimbabwe | Strive Africa", description: "Find programmes, compare destinations and get guided support from university placement to departure.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Strive Africa — Beyond Borders" }] },
  twitter: { card: "summary_large_image", title: "Study Abroad Consultants in Zimbabwe | Strive Africa", description: "University placement, application, visa and travel guidance from Zimbabwe to the world.", images: ["/og.png"] },
};
const organisationData = {
  "@context": "https://schema.org", "@type": "EducationalOrganization", "@id": `${siteUrl}/#organization`,
  name: "Strive Africa", alternateName: ["Strivio Education Solutions", "Strive Afriqa"], url: siteUrl,
  logo: `${siteUrl}/strive-logo.jpeg`, image: `${siteUrl}/og.png`, telephone: "+263716730064", email: "batsirai@striveafriqa.com",
  description: "A Zimbabwe-based education consultancy supporting students with university placements, applications, career guidance, student visa preparation and flight bookings.",
  address: [
    { "@type": "PostalAddress", streetAddress: "6 Chelmsford Road, Office 35, Belgravia", addressLocality: "Harare", addressCountry: "ZW" },
    { "@type": "PostalAddress", streetAddress: "Number 5 Benmore Gardens, Corworx", addressRegion: "Gauteng", addressCountry: "ZA" },
  ],
  sameAs: ["https://www.facebook.com/afriqastrive", "https://www.tiktok.com/@striveafrica.edu", "https://www.instagram.com/strive_africa"],
  knowsAbout: ["University placement", "International university applications", "Career guidance", "Student visa preparation", "Student flight bookings"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationData) }} />
        {children}
      </body>
    </html>
  );
}
