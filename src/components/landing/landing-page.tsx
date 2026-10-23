"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, MapPin, Menu, X, Plus, Sun, Waves, Compass, MessageCircle, Bike, Hotel } from "lucide-react";
import { Button } from "@/components/landing/ui/button";
import { InquiryModal } from "@/components/landing/inquiry-modal";
import { scooters, type Scooter, type Lang } from "@/lib/landing/inquiry";
import { dict, type Dict } from "@/lib/landing/i18n";
import { coastFilmUrl, coastFilmWebmUrl } from "@/lib/landing/media";
import { SpinViewer, d125Frames } from "@/components/landing/spin-viewer";
const hero = "/landing/coast-hero.jpg";
const coastalLife = "/landing/coastal-life.jpg";
const wsPhoto = { url: "/landing/ws150-sport-isolated.png" };
const reptilPhoto = { url: "/landing/vento-reptile-xt200.png" };
const logoLight = { url: "/landing/punta-biker-logo-light.png" };


function Brand({ footer = false, t }: { footer?: boolean; t: Dict }) {
  return <a className="brand" href="#inicio" aria-label={t.home}>
    <img className="brand-logo" src={logoLight.url} alt="Punta Biker" width={1320} height={702} />
    {!footer && <span className="brand-tagline">Ride the Coast</span>}
  </a>;
}

function LangSwitch({ lang, setLang, label }: { lang: Lang; setLang: (l: Lang) => void; label: string }) {
  return <div className="lang-switch" role="group" aria-label={label}>
    {(["es", "en"] as const).map(l => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} lang={l}>{l.toUpperCase()}</button>)}
  </div>;
}

const hrefs = ["#nosotros", "#scooters", "#experiencia", "#como-funciona"];

export function LandingPage() {
  const [lang, setLangState] = useState<Lang>("es");
  function setLang(l: Lang) { setLangState(l); try { localStorage.setItem("pb-lang", l); } catch { /* ignore */ } }
  useEffect(() => { const saved = localStorage.getItem("pb-lang"); if (saved === "en" || saved === "es") setLangState(saved); }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selected, setSelected] = useState<Scooter>(scooters[0]);
  const [filmReady, setFilmReady] = useState(false);
  const [filmFailed, setFilmFailed] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  function inquire(scooter: Scooter = scooters[0]) { setSelected(scooter); setMenuOpen(false); setInquiryOpen(true); }
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionAllowed(!reduced.matches);
    const update = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }), { threshold: .08 });
    pageRef.current?.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    pageRef.current?.classList.add("motion-enabled");
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function keydown(e: KeyboardEvent) {
      if (e.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); }
      if (e.key === "Tab") {
        const elements = [menuButtonRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [])].filter((el): el is HTMLElement => Boolean(el));
        const first = elements[0]; const last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", keydown); };
  }, [menuOpen]);

  const t = dict[lang];
  const links = hrefs.map((href, i) => ({ href, label: t.links[i] }));
  const stepIcons = [Bike, MessageCircle, Compass];
  return <div ref={pageRef} className="pb-landing">
    <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-background text-foreground p-3">{t.skip}</a>
    <header className={`site-nav ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <div className="nav-inner"><Brand t={t} /><nav className="desktop-links" aria-label={t.mainNav}>{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav><div className="nav-actions"><LangSwitch lang={lang} setLang={setLang} label={t.langLabel} /><Button variant="coastOutline" className="nav-cta" onClick={() => inquire()}>{t.plan}<ArrowUpRight size={14} /></Button><Button ref={menuButtonRef} variant="nav" size="icon" className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t.closeMenu : t.openMenu} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X /> : <Menu />}</Button></div></div>
      {menuOpen && <nav id="mobile-menu" className="mobile-menu" ref={menuRef} aria-label={t.mobileNav}>{links.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}<Button variant="coast" className="mobile-inquiry" onClick={() => inquire()}>{t.plan}<ArrowUpRight /></Button></nav>}
      <div className="scroll-progress" ref={progress} aria-hidden="true" />
    </header>
    <main id="contenido">
      <section className="hero" id="inicio" aria-label="Punta Biker, Ride the Coast">
        <img className="hero-photo" src={hero} alt={t.heroAlt} width={1920} height={1088} fetchPriority="high" />
        {coastFilmUrl && motionAllowed && !filmFailed && <video className={`hero-video ${filmReady ? "ready" : ""}`} poster={hero} autoPlay muted loop playsInline preload="metadata" onCanPlay={() => setFilmReady(true)} onError={() => setFilmFailed(true)} aria-hidden="true">{coastFilmWebmUrl && <source src={coastFilmWebmUrl} type="video/webm" />}<source src={coastFilmUrl} type="video/mp4" /></video>}
        <div className="hero-content"><span className="eyebrow hero-location"><MapPin size={12} />LA PUNTA · PUERTO ESCONDIDO, OAXACA</span><h1>Punta Biker<br /><span>Ride the Coast.</span></h1><p className="hero-statement">{t.statement[0]}<br />{t.statement[1]}</p><p className="hero-description">{t.desc[0]}<br />{t.desc[1]}</p><div className="hero-actions"><Button variant="coast" className="hero-cta" onClick={() => inquire()}>{t.findCta}<ArrowUpRight /></Button><a className="explore-link" href="#experiencia">{t.feel}<ArrowDown size={14} /></a></div><span className="hero-note">{t.note}</span></div>
        <div className="hero-bottom"><a className="scroll-cue" href="#nosotros"><ArrowDown size={20} />{t.cue}</a><div className="coordinates"><span>15°51′ N · 97°04′ W</span><span>OAXACA, MÉXICO</span></div></div>
      </section>
      <div className="ticker" aria-label={t.ticker.join(", ")}><div className="ticker-track">{[0, 1, 2, 3].map(n => <div className="ticker-group" key={n} aria-hidden="true">{t.ticker.map(item => <span key={item} className="contents"><span>{item}</span><Sun /></span>)}</div>)}</div></div>
      <section id="nosotros" className="section-wrap introduction reveal"><div className="intro-label"><span className="eyebrow">{t.introLabel[0]}<br />{t.introLabel[1]}</span><Waves size={42} strokeWidth={1} /></div><div><h2>{t.introH[0]}<br />{t.introH[1]}<em>{t.introH[2]}</em></h2><div className="intro-bottom"><p className="body-copy">{t.introP}</p><a className="text-link" href="#scooters">{t.introLink}<ArrowUpRight size={16} /></a></div></div></section>
      <section id="scooters" className="section-wrap fleet"><div className="section-heading reveal"><div><span className="eyebrow">{t.fleetEyebrow}</span><h2>{t.fleetH[0]}<em>{t.fleetH[1]}</em></h2></div><p className="body-copy">{t.fleetP[0]}<br />{t.fleetP[1]}</p></div><div className="fleet-grid">
        <article className="fleet-item reveal"><div className="fleet-image product-cutout"><span className="fleet-number">01 / {t.selection}</span><img src={wsPhoto.url} alt={`Italika WS150 Sport, ${t.productPhoto}`} width={700} height={700} loading="lazy" /></div><div className="fleet-info"><div><span className="eyebrow">ITALIKA</span><h3>WS150 Sport</h3><p>{t.wsLine}</p></div><Button variant="coastOutline" className="round-arrow" size="icon" onClick={() => inquire(scooters[0])} aria-label={`${t.ask} Italika WS150 Sport`} title={`${t.ask} WS150 Sport`}><ArrowUpRight /></Button></div></article>
        <article className="fleet-item reveal"><div className="fleet-image product-cutout"><span className="fleet-number">02 / {t.selection}</span><SpinViewer frames={d125Frames} alt={`${t.d125Name}, ${t.spinAlt}`} hint={t.spinHint} /></div><div className="fleet-info"><div><span className="eyebrow">{t.d125Eyebrow}</span><h3>D125</h3><p>{t.d125Line}</p></div><Button variant="coastOutline" className="round-arrow" size="icon" onClick={() => inquire(scooters[1])} aria-label={`${t.ask} ${t.d125Name}`} title={`${t.ask} ${t.d125Name}`}><ArrowUpRight /></Button></div></article>
        <article className="fleet-item reveal"><div className="fleet-image product-cutout"><span className="fleet-number">03 / {t.selection}</span><SpinViewer alt={`${t.wsAzulName}, ${t.spinAlt}`} hint={t.spinHint} /></div><div className="fleet-info"><div><span className="eyebrow">{t.wsAzulEyebrow}</span><h3>WS150 azul</h3><p>{t.wsAzulLine}</p></div><Button variant="coastOutline" className="round-arrow" size="icon" onClick={() => inquire(scooters[2])} aria-label={`${t.ask} ${t.wsAzulName}`} title={`${t.ask} ${t.wsAzulName}`}><ArrowUpRight /></Button></div></article>
        <article className="fleet-item reveal"><div className="fleet-image product-cutout"><span className="fleet-number">04 / {t.selection}</span><img src={reptilPhoto.url} alt={`${t.reptilName}, ${t.productPhoto}`} width={1012} height={741} loading="lazy" /></div><div className="fleet-info"><div><span className="eyebrow">{t.reptilEyebrow}</span><h3>Reptile Xt 200</h3><p>{t.reptilLine}</p></div><Button variant="coastOutline" className="round-arrow" size="icon" onClick={() => inquire(scooters[3])} aria-label={`${t.ask} ${t.reptilName}`} title={`${t.ask} ${t.reptilName}`}><ArrowUpRight /></Button></div></article>
      </div><p className="fleet-caption">{t.fleetCaption}</p></section>
      <section id="experiencia" className="experience"><div className="section-wrap"><div className="experience-top reveal"><div><span className="eyebrow">{t.expEyebrow}</span><h2>{t.expH[0]}<br /><em>{t.expH[1]}</em></h2></div><p className="body-copy">{t.expP}</p></div><div className="reveal"><img className="experience-photo" src={coastalLife} alt={t.expAlt} width={1440} height={1088} loading="lazy" /><div className="photo-caption"><span>{t.postcards}</span><span>PUERTO ESCONDIDO · OAXACA</span></div></div><div className="coast-moments reveal">{t.moments.map(([label, title, text]) => <div key={label}><span>{label}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
      <section id="como-funciona" className="section-wrap"><div className="section-heading reveal"><div><span className="eyebrow">{t.stepsEyebrow}</span><h2>{t.stepsH[0]}<em>{t.stepsH[1]}</em></h2></div><p className="body-copy">{t.stepsP[0]}<br />{t.stepsP[1]}</p></div><div className="steps reveal">{t.steps.map(([title, text], i) => { const Icon = stepIcons[i] ?? Bike; return <div key={i} className="step"><div className="step-top"><span className="step-number">0{i + 1}</span><Icon size={25} strokeWidth={1.2} /></div><h3>{title}</h3><p className="body-copy">{text}</p></div>; })}</div></section>
      <section className="delivery-band"><div className="section-wrap delivery-inner reveal"><div><span className="eyebrow">{t.delEyebrow}</span><h2>{t.delH[0]}<br /><em>{t.delH[1]}</em></h2></div><div className="delivery-details"><div><MapPin size={22} strokeWidth={1.3} /><h3>{t.delivery[0]?.[0]}</h3><p>{t.delivery[0]?.[1]}</p></div><div><Hotel size={22} strokeWidth={1.3} /><h3>{t.delivery[1]?.[0]}</h3><p>{t.delivery[1]?.[1]}</p></div></div></div></section>
      <section id="preguntas" className="section-wrap faq-section"><div className="reveal"><span className="eyebrow">{t.faqEyebrow}</span><h2>{t.faqH[0]}<br /><em>{t.faqH[1]}</em></h2><p className="body-copy">{t.faqP[0]}<br />{t.faqP[1]}</p></div><div className="faq-list reveal">{t.faqs.map(([question, answer], i) => <details key={i}><summary>{question}<Plus size={17} strokeWidth={1.4} /></summary><p>{answer}</p></details>)}</div></section>
    </main>
    <footer className="footer"><div className="section-wrap footer-main reveal"><div><span className="eyebrow">{t.footEyebrow}</span><h2>{t.footH[0]}<br /><em>{t.footH[1]}</em></h2></div><div><Button variant="coast" className="footer-cta" onClick={() => inquire()}>{t.footCta}<ArrowUpRight /></Button><p className="hero-note">{t.note}</p></div></div><div className="footer-bottom"><Brand footer t={t} /><span className="footer-small">{t.footSmall}<br />© 2026 PUNTA BIKER. <span className="script-line">Ride the Coast.</span></span><a className="back-top" href="#inicio">{t.backTop}<ArrowUp size={15} /></a></div></footer>
    <InquiryModal open={inquiryOpen} onOpenChange={setInquiryOpen} selected={selected} lang={lang} />
  </div>;
}
