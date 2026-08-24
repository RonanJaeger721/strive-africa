"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import raw from "../data/programs.json";

type Programme = {
  id: string;
  country: string;
  level: string;
  program: string;
  university: string;
  fee: number;
  currency: string;
  duration: string;
  durationLabel: string;
};

type SectionLink = { label: string; href: string };

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  programmes?: Programme[];
  links?: SectionLink[];
};

const programmes = raw as Programme[];
const WHATSAPP = "263716730064";
const siteCountries = [
  "Australia", "Bulgaria", "Canada", "France", "Georgia", "Germany", "Greece", "Hungary",
  "India", "Ireland", "Lithuania", "Malaysia", "Mauritius", "Poland", "Russia", "Spain",
  "UAE", "United Kingdom", "Uzbekistan",
];

const STARTERS = [
  "I want to study medicine. What options can I explore?",
  "Show undergraduate programmes in Malaysia.",
  "How can Strive help with my visa application?",
  "Where can I find the office and contact details?",
];

const sectionLinks: SectionLink[] = [
  { label: "Programmes & fees", href: "#courses" },
  { label: "Find my options", href: "#matcher" },
  { label: "Countries", href: "#destinations" },
  { label: "How it works", href: "#process" },
  { label: "Services", href: "#services" },
  { label: "Student journeys", href: "#gallery" },
  { label: "Who we are", href: "#about" },
  { label: "Journal", href: "#journal" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact Strive", href: "#contact" },
];

const normalise = (value: string) => value.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const words = (value: string) => normalise(value).split(" ").filter(word => word.length > 2);
const waUrl = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello Strive, ${text}`)}`;
const universityAliases: Record<string, string> = {
  "Asia Pacific University - APU": "Asia Pacific University (APU)", "Segi": "SEGi University", "SEGI": "SEGi University",
  "PETRE SHOTADZE TBILISI MEDICAL ACADEMY (TMA)": "Petre Shotadze Tbilisi Medical Academy (TMA)",
  "John Neumann University": "John von Neumann University", "Kuala Lumpuh University of Science & Technology - KLUST": "Kuala Lumpur University of Science and Technology (KLUST)",
  "VISTULA": "Vistula University", "VISTULA UNIVERSITY": "Vistula University", "Werkele International Busines School": "Wekerle International University",
};
const displayUniversity = (name: string) => universityAliases[name] || name;

const formatFee = (programme: Programme) => {
  const symbol = programme.currency === "USD" ? "$" : programme.currency === "EUR" ? "€" : "";
  const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(programme.fee);
  return programme.currency ? `${symbol}${amount} ${symbol ? "" : programme.currency}`.trim() : `${amount} · currency not stated`;
};

const isGreeting = (question: string) => /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i.test(question.trim());
const hasAny = (question: string, terms: string[]) => terms.some(term => normalise(question).includes(normalise(term)));

function findProgrammeMatches(question: string) {
  const query = normalise(question);
  const queryWords = words(question);
  const country = siteCountries.find(candidate => query.includes(normalise(candidate)));
  const requestedLevel = query.includes("postgraduate") || query.includes("masters") || query.includes("master")
    ? "Postgraduate"
    : query.includes("undergraduate") || query.includes("bachelor") || query.includes("degree")
      ? "Undergraduate"
      : query.includes("foundation") || query.includes("diploma")
        ? "Diploma / Foundation"
        : undefined;

  const catalogueQuestion = hasAny(question, [
    "programme", "program", "course", "study", "medicine", "business", "engineering", "technology", "it ",
    "university", "tuition", "fee", "budget", "undergraduate", "postgraduate", "bachelor", "masters", "diploma",
    "foundation", "options", "duration",
  ]);
  if (!catalogueQuestion) return [];

  return programmes
    .map(programme => {
      const searchable = normalise(`${programme.country} ${programme.level} ${programme.program} ${programme.university}`);
      let score = 0;
      if (country && normalise(programme.country) === normalise(country)) score += 12;
      if (country && normalise(programme.country) !== normalise(country)) return { programme, score: -1 };
      if (requestedLevel && normalise(programme.level) === normalise(requestedLevel)) score += 7;
      if (requestedLevel && normalise(programme.level) !== normalise(requestedLevel)) return { programme, score: -1 };
      queryWords.forEach(word => { if (searchable.includes(word)) score += word.length > 5 ? 3 : 1; });
      return { programme, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.programme.program.localeCompare(b.programme.program))
    .slice(0, 8)
    .map(result => result.programme);
}

function buildAnswer(question: string): Omit<ChatMessage, "id" | "role"> {
  const query = normalise(question);
  const matches = findProgrammeMatches(question);
  const mentionedCountry = siteCountries.find(candidate => query.includes(normalise(candidate)));

  if (isGreeting(question)) {
    return {
      content: "Hello. I’m the Strive Africa site adviser. I can help you explore programmes and destinations, understand fees and the application journey, learn about Strive’s services, or find the right section of this website.",
      links: sectionLinks,
    };
  }

  if (hasAny(question, ["office", "address", "location", "where are you", "meet the team", "phone", "call", "whatsapp", "contact", "email"])) {
    return {
      content: "You can meet Strive Africa at Office 35, 6 Chelmsford Road, Belgravia, Harare, Zimbabwe. Call or WhatsApp +263 71 673 0064 to discuss your options or start an application.",
      links: [{ label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["eligible", "eligibility", "check my results", "o level", "a level", "passport", "transcript"])) {
    return {
      content: "Use Strive’s free eligibility checker to share your study level, preferred destination, results summary and supporting documents. The team aims to review the information and reply within 24 hours. This is a preliminary human assessment, not an admission or visa decision.",
      links: [{ label: "Open the eligibility checker", href: "#eligibility-checker" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["updates", "email list", "mailing list", "newsletter", "study guide"])) {
    return {
      content: "You can request Strive’s study guide and student-opportunity updates in the Beyond Borders Journal section. Your email is prepared in WhatsApp and is only sent to Strive when you choose to press Send.",
      links: [{ label: "Request updates", href: "#journal" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["visa", "immigration", "embassy", "police clearance", "medical examination"])) {
    return {
      content: "Strive’s Visa Centre helps with a personalised document checklist, forms, financial and sponsorship documents, medical examinations, police clearances, certification, appointments and interview preparation. Immigration authorities make the final visa decision, so current requirements must be confirmed before you apply.",
      links: [{ label: "See visa and travel services", href: "#services" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["application", "apply", "documents", "motivation letter", "personal statement", "offer letter", "admission"])) {
    return {
      content: "Strive supports the application journey by checking entry requirements, reviewing documents, helping with forms and motivation letters, submitting applications, following up on progress, and explaining offers and acceptance procedures. Bring your results and questions to the team for a current assessment.",
      links: [{ label: "See the application process", href: "#process" }, { label: "Application support", href: "#services" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["career", "what should i study", "which course", "choose a course", "choose a programme", "interests", "ambition"])) {
    return {
      content: "Strive connects your interests, academic background, budget and long-term career direction to suitable study pathways. You can start with the programme finder, then speak with the team before making a final choice.",
      links: [{ label: "Find my options", href: "#matcher" }, { label: "Career guidance", href: "#services" }, { label: "Contact Strive", href: "#contact" }],
      programmes: matches,
    };
  }

  if (hasAny(question, ["flight", "travel", "departure", "airport", "baggage", "accommodation", "arrival"])) {
    return {
      content: "After admission and visa approval, Strive can help compare flight options, choose practical dates and routes, check reporting dates, prepare travel documents, organise baggage guidance, and coordinate arrival arrangements where available.",
      links: [{ label: "See travel support", href: "#services" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["how does it work", "process", "steps", "journey", "what happens next", "start"])) {
    return {
      content: "The Strive journey has five stages: tell us about you; explore suitable options; prepare your application; move from offer to visa; then book and depart. The team can guide you from the first search through to departure.",
      links: [{ label: "See how it works", href: "#process" }, { label: "Find programmes", href: "#matcher" }],
    };
  }

  if (hasAny(question, ["service", "placement", "support", "what do you do", "help me"])) {
    return {
      content: "Strive’s five connected services are university placements, application support, career guidance, the Visa Centre, and flight bookings. Together they cover course choice, paperwork, visa preparation and supported departure.",
      links: [{ label: "Explore services", href: "#services" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (!mentionedCountry && hasAny(question, ["country", "countries", "destination", "destinations", "where can i study"])) {
    return {
      content: `The site currently lists ${siteCountries.length} study destinations: ${siteCountries.join(", ")}. Open a country for its overview, local currency, listed programmes and tuition range, or use the finder to compare options.`,
      links: [{ label: "Explore countries", href: "#destinations" }, { label: "Use the programme finder", href: "#matcher" }],
    };
  }

  if (mentionedCountry && !matches.length) {
    const listed = programmes.filter(programme => programme.country === mentionedCountry).length;
    return listed ? {
      content: `${mentionedCountry} currently has ${listed} programme options in Strive’s supplied catalogue. Open the destination overview for its local currency and tuition range, or use the programme finder to narrow the list by level, university and subject.`,
      links: [{ label: `Explore ${mentionedCountry}`, href: "#destinations" }, { label: "Search programmes", href: "#matcher" }],
    } : {
      content: `${mentionedCountry} is available through consultation, but Strive’s supplied catalogue does not yet contain verified programme and fee rows for it. Ask the team to investigate suitable universities, current fees and entry requirements for your profile.`,
      links: [{ label: "Open destination information", href: "#destinations" }, { label: "Ask Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["fee", "fees", "tuition", "cost", "price", "budget", "exchange rate", "final"])) {
    const feeText = matches.length
      ? `I found ${matches.length} catalogue option${matches.length === 1 ? "" : "s"} related to your question. The listed amounts are shown in the matching cards below.`
      : "The programme finder and country panels show tuition figures from Strive’s supplied master catalogue.";
    return {
      content: `${feeText} Fees, exchange rates and intakes can change, so Strive must verify the current amount and availability before you apply. Living costs, visa, insurance, flights and other charges may be separate.`,
      programmes: matches,
      links: [{ label: "View programmes and fees", href: "#courses" }, { label: "Explore country ranges", href: "#destinations" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["gallery", "photo", "photos", "student journey", "student experience", "review"])) {
    return {
      content: "The Student Journeys section contains real departure, campus and student-life photographs supplied for Strive Africa’s journey record. The Student Experiences section explains how feedback is confirmed and published with permission.",
      links: [{ label: "View student journeys", href: "#gallery" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (hasAny(question, ["facebook", "instagram", "tiktok", "social media", "follow strive"])) {
    return {
      content: "You can follow Strive Africa on Facebook, TikTok and Instagram. The official links are collected in the Who We Are section and repeated in the footer.",
      links: [{ label: "Open social links", href: "#about" }],
    };
  }

  if (hasAny(question, ["journal", "advice", "tips", "prepare early"])) {
    return {
      content: "The Beyond Borders Journal shares practical guidance on choosing a university, preparing documents early, and moving from an offer letter to the boarding gate.",
      links: [{ label: "Read the journal", href: "#journal" }, { label: "See the process", href: "#process" }],
    };
  }

  if (hasAny(question, ["faq", "frequently asked", "are these fees", "no programmes", "listed"])) {
    return {
      content: "The FAQ section covers whether fees are final, choosing a course, destinations without listed programmes, and where to meet the Strive team. For anything specific to your situation, the team can confirm the current details directly.",
      links: [{ label: "Open FAQs", href: "#faq" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  if (matches.length) {
    return {
      content: `I found ${matches.length} catalogue option${matches.length === 1 ? "" : "s"} related to your question. Open the cards below for the listed country, level, university, fee and duration. Current fees, intakes, entry requirements and availability must be verified with Strive before applying.`,
      programmes: matches,
      links: [{ label: "Open the full catalogue", href: "#courses" }, { label: "Ask Strive", href: "#contact" }],
    };
  }

  if (query.includes("about strive") || query.includes("who are you") || query.includes("what is strive")) {
    return {
      content: "Strivio Education Solutions is a Zimbabwe-based education consultancy connecting students with international study opportunities. Its directors bring industry experience and international exposure, and Strivio also supports Southern African student recruitment as a supplier to Nexafriqa (Pty) Ltd in South Africa.",
      links: [{ label: "Who we are", href: "#about" }, { label: "Explore services", href: "#services" }, { label: "Contact Strive", href: "#contact" }],
    };
  }

  return {
    content: "I can answer questions about Strive’s programmes, universities, destinations, listed fees, application process, visa guidance, flight support, student journeys, journal and contact details. Try asking what you want to study, where you want to go, or how Strive can help.",
    links: sectionLinks,
  };
}

function ProgrammeOptions({ programmes: matches }: { programmes: Programme[] }) {
  const [country, setCountry] = useState("all");
  const [level, setLevel] = useState("all");
  const filtered = useMemo(() => matches.filter(programme => (country === "all" || programme.country === country) && (level === "all" || programme.level === level)), [country, level, matches]);
  const countries = useMemo(() => [...new Set(matches.map(programme => programme.country))].sort(), [matches]);
  const levels = useMemo(() => [...new Set(matches.map(programme => programme.level))].sort(), [matches]);

  return <details className="striveChatOptions"><summary><span><b>Matching programme options</b><small>View {matches.length} catalogue {matches.length === 1 ? "option" : "options"}</small></span><i>⌄</i></summary><div className="striveChatOptionsBody"><div className="striveChatFilters"><label>Country<select value={country} onChange={event => setCountry(event.target.value)}><option value="all">All countries</option>{countries.map(option => <option key={option}>{option}</option>)}</select></label><label>Study level<select value={level} onChange={event => setLevel(event.target.value)}><option value="all">All levels</option>{levels.map(option => <option key={option}>{option}</option>)}</select></label></div><p className="striveChatFilterSummary">Showing {filtered.length} of {matches.length} options</p>{filtered.map(programme => <article className="striveChatProgramme" key={programme.id}><div><span>{programme.country} · {programme.level}</span><h4>{programme.program}</h4><p>{displayUniversity(programme.university)}</p></div><b>{formatFee(programme)}</b>{(programme.durationLabel || programme.duration) && <small>Duration: {programme.durationLabel || programme.duration}</small>}<a href={waUrl(`I would like details about ${programme.program} at ${displayUniversity(programme.university)} in ${programme.country}.`)} target="_blank" rel="noreferrer">Request details from Strive ↗</a></article>)}</div></details>;
}

export default function StriveFloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answering, setAnswering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, answering]);

  const clear = () => { if (!answering) setMessages([]); };
  const send = (value = input) => {
    const question = value.trim();
    if (!question || answering) return;
    setInput("");
    const messageNumber = ++messageCounterRef.current;
    const assistantId = `assistant-${messageNumber}`;
    setMessages(current => [...current, { id: `user-${messageNumber}`, role: "user", content: question }, { id: assistantId, role: "assistant", content: "" }]);
    setAnswering(true);
    window.setTimeout(() => {
      const answer = buildAnswer(question);
      setMessages(current => current.map(message => message.id === assistantId ? { id: assistantId, role: "assistant", ...answer } : message));
      setAnswering(false);
    }, 260);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); send(); };

    return <div className="striveChatFloat">{open && <section className="striveChatPanel" role="dialog" aria-label="Strive Africa site adviser"><header><div><span>✦ STRIVE SITE ADVISER</span><b>Your next step, made clearer.</b></div><div><button type="button" onClick={clear} disabled={answering}>↻ <em>Clear</em></button><button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button></div></header><div className="striveChatMessages" ref={scrollRef}>{messages.length === 0 ? <div className="striveChatWelcome"><span>✦ Answers grounded in this website</span><h2>How can we help?</h2><p>Ask about programmes, countries, fees, applications, visas, flights, services, student journeys or any section of the Strive Africa site.</p><div>{STARTERS.map(starter => <button type="button" key={starter} disabled={answering} onClick={() => send(starter)}>{starter} <i>↗</i></button>)}</div></div> : messages.map(message => <article key={message.id} className={`striveChatMessage ${message.role}`}><div className="striveChatBubble">{message.role === "assistant" && !message.content ? <span className="striveChatTyping" aria-label="Strive adviser is typing"><i/><i/><i/></span> : <p>{message.content}</p>}</div>{message.role === "assistant" && message.programmes?.length ? <ProgrammeOptions programmes={message.programmes} /> : null}{message.role === "assistant" && message.links?.length ? <div className="striveChatLinks" aria-label="Relevant website sections">{message.links.map(link => <a key={`${message.id}-${link.href}`} href={link.href} onClick={event => {setOpen(false);if(link.href==="#eligibility-checker"){event.preventDefault();document.querySelector<HTMLButtonElement>("#eligibility-checker")?.click()}}}>{link.label} <span>↗</span></a>)}</div> : null}</article>)}</div><form onSubmit={submit}><textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(event); } }} placeholder="Ask about a course, country, budget or section…" rows={1} disabled={answering}/><button type="submit" disabled={!input.trim() || answering} aria-label="Send message">↑</button></form><p className="striveChatLegal">Listed fees and availability must be verified with Strive before applying.</p></section>}<button type="button" className="striveChatLauncher" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Ask Strive about this site"><i>◌</i><span>Ask Strive</span>{open && <b>×</b>}</button></div>;
}
