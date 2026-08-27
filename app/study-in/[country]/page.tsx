import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import rawPrograms from "../../data/programs.json";
import { countries, countryFromSlug, countrySlug, destinationNotes, siteUrl } from "../../data/destinations";

type Programme = { id: string; country: string; level: string; program: string; university: string; fee: number; currency: string; durationLabel: string };
const programmes = rawPrograms as Programme[];

const feeLabel = (programme: Programme) => {
  const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(programme.fee);
  if (programme.currency === "USD") return `$${amount} USD`;
  if (programme.currency === "EUR") return `€${amount} EUR`;
  return `${amount} · currency not stated`;
};

export function generateStaticParams() {
  return countries.map((country) => ({ country: countrySlug(country) }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: slug } = await params;
  const country = countryFromSlug(slug);
  if (!country) return {};
  const count = programmes.filter((programme) => programme.country === country).length;
  const title = `Study in ${country} from Zimbabwe | Strive Africa`;
  const description = count
    ? `Explore ${count} university programmes and supplied tuition figures for studying in ${country} from Zimbabwe. Get application, visa and travel guidance from Strive Africa.`
    : `Explore study options in ${country} from Zimbabwe and ask Strive Africa for current universities, entry requirements, tuition fees and application guidance.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/study-in/${slug}` },
    openGraph: { title, description, url: `${siteUrl}/study-in/${slug}`, images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = countryFromSlug(slug);
  if (!country) notFound();
  const rows = programmes.filter((programme) => programme.country === country);
  const universities = new Set(rows.map((programme) => programme.university)).size;
  const note = destinationNotes[country];
  const whatsappText = encodeURIComponent(`Hello Strive, I would like current study options, entry requirements and fees for ${country}.`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: `Study in ${country}`, item: `${siteUrl}/study-in/${slug}` },
      ] },
      { "@type": "WebPage", name: `Study in ${country} from Zimbabwe`, url: `${siteUrl}/study-in/${slug}`, description: note.summary, isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@type": "Country", name: country } },
    ],
  };

  return <main className="destinationPage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="destinationNav">
      <Link href="/" aria-label="Strive Africa home"><Image src="/strive-logo.jpeg" width={145} height={78} alt="Strive Africa" priority /></Link>
      <nav><Link href="/#courses">Programmes</Link><Link href="/#destinations">Countries</Link><Link href="/#services">Services</Link></nav>
      <a className="destinationNavCta" href={`https://wa.me/263716730064?text=${whatsappText}`} target="_blank" rel="noreferrer">Talk to us ↗</a>
    </header>

    <section className="destinationSeoHero">
      <div className="destinationSeoCopy">
        <span>STUDY ABROAD FROM ZIMBABWE · {country.toUpperCase()}</span>
        <h1>Study in<br/><em>{country}.</em></h1>
        <p>{note.summary} Explore the verified options currently in Strive’s catalogue, then speak with our Harare team about eligibility and applications.</p>
        <div className="destinationSeoActions"><a href={`https://wa.me/263716730064?text=${whatsappText}`} target="_blank" rel="noreferrer">Ask about {country} ↗</a><Link href="/#matcher">Search all programmes</Link></div>
      </div>
      <aside className="destinationSeoFacts">
        <span>DESTINATION SNAPSHOT</span>
        <div><small>Programmes listed</small><b>{rows.length || "By consultation"}</b></div>
        <div><small>Universities listed</small><b>{universities || "Being confirmed"}</b></div>
        <div><small>Local currency</small><b>{note.currency}</b></div>
        <p>Catalogue fees are guidance only and are confirmed again before application.</p>
      </aside>
    </section>

    <section className="destinationSeoJourney">
      <div><span>YOUR ROUTE</span><h2>From Zimbabwe<br/>to {country}.</h2></div>
      <ol><li><b>01</b><span>Check your academic profile and eligibility</span></li><li><b>02</b><span>Compare suitable programmes and institutions</span></li><li><b>03</b><span>Prepare and submit your application</span></li><li><b>04</b><span>Plan your visa, flight and departure</span></li></ol>
    </section>

    <section className="destinationSeoProgrammes">
      <div className="destinationSeoHeading"><span>PROGRAMMES &amp; SUPPLIED FEES</span><h2>{rows.length ? `${rows.length} options in ${country}` : `Current options for ${country}`}</h2><p>{rows.length ? "A selection from Strive’s supplied master catalogue. Contact the team to confirm the latest intake, requirements and full cost." : "This destination is available through consultation while its verified programme and fee list is being confirmed."}</p></div>
      {rows.length ? <div className="seoProgrammeGrid">{rows.slice(0, 18).map((programme) => <article key={programme.id}><small>{programme.level} · {programme.durationLabel || "Duration on request"}</small><h3>{programme.program}</h3><p>{programme.university}</p><b>{feeLabel(programme)}</b></article>)}</div> : <div className="seoConsultation"><b>Tell us what you want to study.</b><p>Strive will check suitable universities, entry requirements, current intakes and costs for your profile.</p><a href={`https://wa.me/263716730064?text=${whatsappText}`} target="_blank" rel="noreferrer">Request current options ↗</a></div>}
      {rows.length > 18 && <Link className="seoMore" href="/#matcher">Explore the full catalogue on our programme finder ↗</Link>}
    </section>

    <section className="destinationSeoTrust"><span>LOCAL GUIDANCE · INTERNATIONAL DIRECTION</span><h2>Make the decision<br/>with clearer information.</h2><p>Strive Africa supports Zimbabwean students with university placement, applications, career guidance, visa preparation and flight bookings. Admission and visa decisions remain with the relevant institution and immigration authority.</p><a href={`https://wa.me/263716730064?text=${whatsappText}`} target="_blank" rel="noreferrer">Talk to the Strive team ↗</a></section>

    <footer className="destinationSeoFooter"><Link href="/">Strive Africa · Beyond Borders</Link><span>6 Chelmsford Road, Office 35, Belgravia, Harare</span><a href="tel:+263716730064">+263 71 673 0064</a></footer>
  </main>;
}
