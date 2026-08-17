"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

const courses=[
 {name:"Business & Management",level:"Undergraduate",place:"United Kingdom",note:"Leadership, entrepreneurship, finance and global business pathways.",tag:"Popular pathway"},
 {name:"Computer Science",level:"Undergraduate",place:"Canada",note:"Software development, data, cybersecurity and intelligent systems.",tag:"Technology"},
 {name:"Public Health",level:"Postgraduate",place:"United Kingdom",note:"Community health, policy, research and healthcare leadership.",tag:"Health sciences"},
 {name:"Engineering",level:"Undergraduate",place:"Australia",note:"Civil, mechanical, electrical and sustainable engineering routes.",tag:"STEM"},
 {name:"Data Science",level:"Postgraduate",place:"United States",note:"Analytics, machine learning and evidence-led decision making.",tag:"Technology"},
 {name:"International Law",level:"Postgraduate",place:"Europe",note:"Global policy, justice, diplomacy and international legal systems.",tag:"Law & policy"}
];
const steps=[
 ["01","Tell us about you","Share your study interests, academic background, preferred destination and budget range."],
 ["02","Explore suitable options","We help you compare relevant courses and institutions against your goals."],
 ["03","Prepare your application","Get guidance on documents, personal statements, deadlines and submission."],
 ["04","Move from offer to visa","Understand your offer, prepare for the visa process and plan your next steps."],
 ["05","Book and depart","Complete travel planning and flight bookings with support before departure."]
];
const services=[
 ["University placements","Find options that make sense for your academic profile, plans and circumstances.","Course and institution shortlisting"],
 ["Application support","Bring every requirement into one clear, manageable application process.","Documents, statements and submissions"],
 ["Career guidance","Connect subjects, strengths and ambitions to a study path with long-term potential.","Study-to-career planning"],
 ["Visa centre","Prepare carefully for each stage of the student visa process.","Checklist and document guidance"],
 ["Flight bookings","Turn an accepted offer into a practical, supported departure plan.","Travel planning and booking support"]
];
const destinations=[
 ["United Kingdom","Wide course choice and multiple intake possibilities."],
 ["Canada","Career-focused programmes across diverse study areas."],
 ["Australia","Globally recognised study and strong student support."],
 ["United States","Flexible pathways across a broad university landscape."],
 ["Europe","International programmes across varied cultures and cities."]
];

export default function Home(){
 const [destination,setDestination]=useState(""); const [query,setQuery]=useState(""); const [level,setLevel]=useState(""); const [searched,setSearched]=useState(false); const [login,setLogin]=useState(false); const [menu,setMenu]=useState(false); const [openFaq,setOpenFaq]=useState(0);
 useEffect(()=>{const nodes=document.querySelectorAll("[data-reveal]");const ob=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("seen")),{threshold:.08});nodes.forEach(n=>ob.observe(n));return()=>ob.disconnect()},[]);
 const results=useMemo(()=>courses.filter(c=>(!destination||c.place===destination)&&(!level||c.level===level)&&(!query||`${c.name} ${c.note} ${c.tag}`.toLowerCase().includes(query.toLowerCase()))),[destination,level,query]);
 function search(e:FormEvent){e.preventDefault();setSearched(true);setTimeout(()=>document.querySelector("#matches")?.scrollIntoView({behavior:"smooth"}),40)}
 const faqs=[
  ["When should I start my application?","Starting early gives you more time to research, prepare documents and respond to university or visa requirements. Contact Strive with your preferred intake so the team can map your timeline."],
  ["Can you help me choose a course?","Yes. Career guidance is part of the service. Strive helps you connect your interests, academic background and career direction to suitable study pathways."],
  ["Do you assist after I receive an offer?","Yes. Support continues through offer guidance, visa preparation and flight-booking assistance."],
  ["Where can I meet the team?","Visit Office 35, 6 Chelmsford Road, Belgravia, Harare, Zimbabwe, or call and WhatsApp 078 858 8061."]
 ];
 return <main>
  <header className="siteHeader"><a className="logo" href="#top"><Image src="/strive-logo.jpeg" width={150} height={82} alt="Strive Africa — Beyond Borders" priority/></a><nav className="desktopNav"><a href="#courses">Courses</a><a href="#destinations">Destinations</a><a href="#process">How it works</a><a href="#services">Services</a><a href="#contact">Contact</a></nav><div className="headerActions"><button className="loginBtn" onClick={()=>setLogin(true)}>Student login</button><a className="headerCta" href="#matcher">Find my options <span>↗</span></a></div><button className="menuBtn" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?"×":"☰"}</button>{menu&&<div className="mobileMenu"><a href="#courses" onClick={()=>setMenu(false)}>Courses</a><a href="#destinations" onClick={()=>setMenu(false)}>Destinations</a><a href="#process" onClick={()=>setMenu(false)}>How it works</a><a href="#services" onClick={()=>setMenu(false)}>Services</a><button onClick={()=>{setLogin(true);setMenu(false)}}>Student login</button></div>}</header>

  <section className="hero" id="top"><div className="heroText" data-reveal><span className="kicker"><i/> Study abroad support from Harare</span><h1>Discover a university path that <em>fits you.</em></h1><p className="lead">From choosing a course to submitting applications, preparing your visa and booking your flight—Strive helps you move forward with clarity.</p><div className="heroLinks"><a href="#matcher">Find my study options <span>↗</span></a><a href="https://wa.me/263788588061" target="_blank">Talk to a consultant</a></div><div className="supportLine"><b>One guided journey</b><span>Placement</span><span>Application</span><span>Visa</span><span>Flight</span></div></div>
   <div className="heroVisual" data-reveal><Image src="/strive/student-airport.webp" alt="Student preparing to board an international flight" width={1800} height={879} priority sizes="(max-width: 720px) 100vw, 48vw"/><div className="travelCaption"><span>04 / DEPARTURE</span><b>Your next chapter starts here.</b><small>From accepted offer to the boarding gate.</small></div><div className="routePill"><i/> HARARE <span>→</span> YOUR FUTURE</div></div>
  </section>

  <section className="matcher" id="matcher"><div className="matcherIntro"><span>START HERE</span><h2>What would you<br/>like to study?</h2><p>Search the sample pathways below, then speak with our team for verified university availability, entry requirements, fees and intakes.</p></div><form className="searchForm" onSubmit={search}><label><span>01 / STUDY AREA</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. Computer Science"/></label><label><span>02 / DESTINATION</span><select value={destination} onChange={e=>setDestination(e.target.value)}><option value="">Any destination</option>{destinations.map(d=><option key={d[0]}>{d[0]}</option>)}</select></label><label><span>03 / STUDY LEVEL</span><select value={level} onChange={e=>setLevel(e.target.value)}><option value="">Any level</option><option>Undergraduate</option><option>Postgraduate</option></select></label><button>Show my options <span>↗</span></button></form></section>

  <section className="courseSection" id="courses"><div className="sectionLabel"><span>EXPLORE STUDY AREAS</span><b>Representative pathways</b></div><div className="titleRow"><h2>Start with a subject.<br/>Build toward a future.</h2><p>Not sure what to choose? Strive’s career-guidance process helps turn broad interests into a practical study direction.</p></div><div className="courseGrid">{courses.slice(0,4).map((c,i)=><article key={c.name} data-reveal><div className="courseNumber">0{i+1}</div><span className="courseTag">{c.tag}</span><h3>{c.name}</h3><p>{c.note}</p><div><span>{c.level}</span><a href={`#matcher`} onClick={()=>setQuery(c.name)}>Explore pathway ↗</a></div></article>)}</div></section>

  {searched&&<section className="matches" id="matches"><div><span>YOUR SEARCH</span><h2>{results.length} sample {results.length===1?"pathway":"pathways"}</h2><p>These are starting points for a conversation, not confirmed offers or live university inventory.</p></div><div className="resultList">{results.length?results.map((c,i)=><article key={c.name}><b>0{i+1}</b><div><small>{c.level} · {c.place}</small><h3>{c.name}</h3><p>{c.note}</p></div><a href="https://wa.me/263788588061" target="_blank">Discuss with Strive ↗</a></article>):<article><div><h3>No exact sample found.</h3><p>Our consultants can explore more study areas with you.</p></div><a href="https://wa.me/263788588061" target="_blank">Ask Strive ↗</a></article>}</div></section>}

  <section className="process" id="process"><div className="processHead" data-reveal><span>HOW IT WORKS</span><h2>From uncertainty to<br/><em>a clear next step.</em></h2><p>There is a lot to coordinate when you study abroad. We break it into a sequence you can understand and act on.</p></div><div className="consultationStory" data-reveal><div className="storyImage"><Image src="/strive/student-consultation.webp" alt="Student reviewing an application with an education consultant" width={1600} height={1024} sizes="(max-width: 720px) 100vw, 57vw"/></div><div><span>REAL GUIDANCE</span><h3>Plan it with someone who understands the process.</h3><p>Bring your questions, results and ambitions. A Strive consultant helps turn them into an organised route from course choice through application.</p><a href="https://wa.me/263788588061" target="_blank">Book a conversation ↗</a></div></div><div className="steps">{steps.map((s,i)=><article key={s[1]} data-reveal><b>{s[0]}</b><div><span>{i===0?"BEGIN HERE":i===4?"READY TO GO":"KEEP MOVING"}</span><h3>{s[1]}</h3><p>{s[2]}</p></div><i>↗</i></article>)}</div></section>

  <section className="destinations" id="destinations"><div className="destinationIntro" data-reveal><span>STUDY DESTINATIONS</span><h2>One ambition.<br/>Many possible places.</h2><p>Your best destination depends on more than popularity. We help you consider course fit, budget, entry route and personal goals.</p><a href="#matcher">Compare your options ↗</a></div><div className="destinationList">{destinations.map((d,i)=><article key={d[0]} data-reveal><span>0{i+1}</span><h3>{d[0]}</h3><p>{d[1]}</p><i>↗</i></article>)}</div></section>

  <section className="services" id="services"><div className="sectionLabel light"><span>STRIVE SUPPORT</span><b>Before, during and after application</b></div><div className="serviceHeadline"><h2>Five services.<br/><em>One connected journey.</em></h2><p>You should not have to coordinate every stage alone. Strive brings your university search, paperwork, preparation and travel into one guided route.</p></div><div className="serviceGrid">{services.map((s,i)=><article key={s[0]} data-reveal><span>0{i+1}</span><small>{s[2]}</small><h3>{s[0]}</h3><p>{s[1]}</p></article>)}</div></section>

  <section className="checklist"><div className="checklistCard" data-reveal><span>APPLICATION READINESS</span><h2>Bring what you have.<br/>We’ll map what comes next.</h2><p>Requirements vary by university, programme and destination. These are common starting documents—not a final checklist.</p><div className="checks">{["Academic results or transcripts","Passport or identification","Preferred course and intake","English-language evidence, if required","A realistic study budget range","Any previous offer or application records"].map(x=><div key={x}><i>✓</i>{x}</div>)}</div><a href="https://wa.me/263788588061" target="_blank">Request a consultation ↗</a></div><aside><span>NEED HELP?</span><h3>Speak to a person,<br/>not a search result.</h3><p>Call or WhatsApp our Harare team and explain where you are in the process.</p><a href="tel:+263788588061">078 858 8061</a><small>Mon–Fri · Visit by arrangement</small></aside></section>

  <section className="faq"><div><span>QUESTIONS, ANSWERED</span><h2>Before you<br/>get started.</h2></div><div className="faqList">{faqs.map((f,i)=><article key={f[0]}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)}><span>0{i+1}</span><b>{f[0]}</b><i>{openFaq===i?"−":"+"}</i></button>{openFaq===i&&<p>{f[1]}</p>}</article>)}</div></section>

  <section className="contact" id="contact"><span>READY WHEN YOU ARE</span><h2>Let’s make your next<br/>step <em>clear.</em></h2><p>Meet the Strive team in Belgravia or start the conversation on WhatsApp.</p><div><a href="https://wa.me/263788588061" target="_blank">WhatsApp Strive ↗</a><a href="tel:+263788588061">Call 078 858 8061</a></div></section>
  <footer><div className="footerAbout"><a href="#top"><Image src="/strive-logo.jpeg" width={170} height={92} alt="Strive Africa"/></a><p>Study abroad guidance from first idea to final departure.</p></div><div><small>EXPLORE</small><a href="#courses">Study areas</a><a href="#destinations">Destinations</a><a href="#process">How it works</a></div><div><small>SERVICES</small><a href="#services">University placement</a><a href="#services">Applications</a><a href="#services">Visa & flights</a></div><div><small>VISIT US</small><p>6 Chelmsford Road, Office 35<br/>Belgravia, Harare, Zimbabwe</p><a href="tel:+263788588061">+263 78 858 8061</a></div><div className="footerBottom"><span>© 2026 Strive Africa</span><a href="#top">Back to top ↑</a></div></footer>

  {login&&<div className="modalWrap" onMouseDown={e=>e.target===e.currentTarget&&setLogin(false)}><div className="modal" role="dialog" aria-modal="true" aria-label="Student login"><button className="close" onClick={()=>setLogin(false)}>×</button><span>STUDENT PORTAL</span><h2>Welcome back.</h2><p>Track saved study options and your application journey.</p><label>Email address<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><button className="modalSubmit" onClick={()=>setLogin(false)}>Continue ↗</button><small>Portal access is currently a preview. Contact Strive to begin an application.</small></div></div>}
 </main>
}
