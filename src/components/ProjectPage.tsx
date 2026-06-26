"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Project } from "@/lib/projects";

type Rect = { top: number; left: number; width: number; height: number };
type Lenis = { stop: () => void; start: () => void };
const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

function SitePlan({ label }: { label: string }) {
  return (
    <div className="sp" role="img" aria-label={`Site plan, ${label}`}>
      <span className="sp-road rh" /><span className="sp-road rv" />
      <span className="sp-blk b1" /><span className="sp-blk b2" /><span className="sp-blk b3" />
      <span className="sp-blk b4" /><span className="sp-blk b5" /><span className="sp-blk b6" />
      <span className="sp-grn gA" /><span className="sp-grn gB" />
      <span className="sp-site" />
      <span className="sp-tag mono">SITE PLAN · {label}</span>
    </div>
  );
}

export default function ProjectPage({ p, rect, onClose }: { p: Project; rect: Rect; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  // FLIP open: the clicked image expands into the hero
  useLayoutEffect(() => {
    getLenis()?.stop();
    document.body.style.overflow = "hidden";

    const el = img.current!;
    const hr = el.getBoundingClientRect();
    const sx = rect.width / hr.width;
    const sy = rect.height / hr.height;
    const tx = rect.left - hr.left;
    const ty = rect.top - hr.top;

    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { x: tx, y: ty, scaleX: sx, scaleY: sy },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.72, ease: "power3.inOut" }
    )
      .fromTo(".pp-bg", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
      .fromTo(".pp-hero-cap > *", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" }, 0.32)
      .fromTo(".pp-fade", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: "power3.out" }, 0.3);

    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [rect]);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const el = img.current!;
    const hr = el.getBoundingClientRect();
    const sx = rect.width / hr.width;
    const sy = rect.height / hr.height;
    const tx = rect.left - hr.left;
    const ty = rect.top - hr.top;
    const scrolled = root.current ? root.current.scrollTop : 0;

    const tl = gsap.timeline({ onComplete: onClose });
    // if scrolled away, just fade; otherwise collapse back into the thumbnail
    if (scrolled < window.innerHeight * 0.6) {
      tl.to(".pp-fade, .pp-hero-cap", { opacity: 0, duration: 0.25, ease: "power2.out" }, 0)
        .to(el, { x: tx, y: ty, scaleX: sx, scaleY: sy, duration: 0.6, ease: "power3.inOut" }, 0)
        .to(".pp-bg", { opacity: 0, duration: 0.55, ease: "power2.in" }, 0.1);
    } else {
      tl.to(root.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pp" ref={root} role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="pp-bg" />
      <button className="pp-close mono" data-cursor onClick={close} aria-label="Close">Close ✕</button>

      <section className="pp-hero">
        <div ref={img} className="pp-hero-img"><div className={`scene ${p.scene}`} /></div>
        <div className="pp-hero-cap">
          <span className="mono pp-no">Project {p.no} · {p.category}</span>
          <h1 className="display pp-name">{p.name}</h1>
          <span className="mono pp-arch">Architecture · {p.architect}</span>
        </div>
      </section>

      <section className="pp-intro">
        <div className="pp-fade pp-meta">
          <dl className="pp-dl">
            <div><dt className="mono">Architecture</dt><dd>{p.architect}</dd></div>
            <div><dt className="mono">Visualisation</dt><dd>Space Scape</dd></div>
            <div><dt className="mono">Location</dt><dd>{p.location}</dd></div>
            <div><dt className="mono">Year</dt><dd>{p.year}</dd></div>
            <div><dt className="mono">Typology</dt><dd>{p.typology}</dd></div>
            <div><dt className="mono">Scale</dt><dd>{p.size}</dd></div>
            <div><dt className="mono">Status</dt><dd>{p.status}</dd></div>
          </dl>
        </div>
        <div className="pp-fade pp-lede"><p>{p.desc}</p></div>
      </section>

      <figure className="pp-fade pp-figure"><div className={`scene ${p.sceneB}`} /></figure>

      <section className="pp-fade pp-text"><p>{p.desc2}</p></section>

      <figure className="pp-fade pp-plan"><SitePlan label={p.location} /></figure>

      <footer className="pp-fade pp-foot">
        <button className="pp-back mono" data-cursor onClick={close}>← Back to Work</button>
        <span className="mono">Space Scape · Architectural Visualisation</span>
      </footer>

      <style>{`
        .pp { position: fixed; inset: 0; z-index: 9500; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
        .pp-bg { position: fixed; inset: 0; background: var(--bg); z-index: -1; }
        .pp-close { position: fixed; top: 20px; right: clamp(18px,4vw,44px); z-index: 20; font-size: 10px; color: var(--ink); border: 1px solid var(--line); background: var(--bg); padding: 9px 13px; }
        .pp-close:hover { background: var(--ink); color: var(--bg); }

        .pp-hero { position: relative; height: 88vh; overflow: hidden; }
        .pp-hero-img { position: absolute; inset: 0; transform-origin: 0 0; will-change: transform; }
        .pp-hero-img .scene { position: absolute; inset: 0; }
        .pp-hero-cap { position: absolute; left: clamp(20px,4vw,64px); bottom: clamp(28px,6vh,64px); z-index: 4; display: flex; flex-direction: column; gap: 12px; }
        .pp-no { font-size: 10px; color: rgba(255,255,255,0.8); }
        .pp-name { font-size: clamp(38px,7vw,120px); color: #fff; line-height: 0.95; }
        .pp-arch { font-size: 10px; color: var(--bronze); letter-spacing: .18em; }

        .pp-intro { max-width: 1500px; margin: 0 auto; padding: clamp(70px,12vh,150px) clamp(20px,4vw,64px); display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(30px,6vw,100px); align-items: start; }
        .pp-dl { display: flex; flex-direction: column; }
        .pp-dl > div { display: flex; justify-content: space-between; gap: 18px; padding: 13px 0; border-top: 1px solid var(--line-soft); }
        .pp-dl > div:last-child { border-bottom: 1px solid var(--line-soft); }
        .pp-dl dt { font-size: 9px; color: var(--mut); }
        .pp-dl dd { font-family: var(--font-mono); font-size: 12px; color: var(--ink); text-align: right; }
        .pp-lede p { font-size: clamp(22px,2.6vw,40px); line-height: 1.25; letter-spacing: -0.02em; color: var(--ink); }

        .pp-figure { position: relative; height: 86vh; overflow: hidden; margin: 0; }
        .pp-figure .scene { position: absolute; inset: 0; }

        .pp-text { max-width: 820px; margin: 0 auto; padding: clamp(70px,12vh,150px) clamp(20px,4vw,40px); }
        .pp-text p { font-size: clamp(17px,1.6vw,24px); line-height: 1.75; color: var(--ink); }

        .pp-plan { position: relative; height: 84vh; margin: 0; }
        .pp-plan .sp { width: 100%; height: 100%; }

        .pp-foot { max-width: 1500px; margin: 0 auto; padding: clamp(50px,9vh,90px) clamp(20px,4vw,64px); display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; border-top: 1px solid var(--line); }
        .pp-foot .mono { font-size: 9px; color: var(--mut); }
        .pp-back { font-size: 11px; color: var(--ink); }
        .pp-back:hover { color: var(--bronze); }

        .sp { position: relative; background: #f1f0ec; overflow: hidden; }
        .sp::before { content: ""; position: absolute; inset: 0; background:
          repeating-linear-gradient(90deg, transparent 0 54px, rgba(15,15,16,0.045) 54px 55px),
          repeating-linear-gradient(0deg, transparent 0 54px, rgba(15,15,16,0.045) 54px 55px); }
        .sp-road { position: absolute; background: #fff; box-shadow: 0 0 0 1px rgba(15,15,16,0.07); }
        .sp-road.rh { left: 0; right: 0; top: 62%; height: 48px; }
        .sp-road.rv { top: 0; bottom: 0; left: 24%; width: 44px; transform: skewX(-12deg); }
        .sp-blk { position: absolute; background: #fff; border: 1px solid rgba(15,15,16,0.16); }
        .sp-blk.b1 { left: 30%; top: 14%; width: 16%; height: 13%; }
        .sp-blk.b2 { left: 52%; top: 10%; width: 22%; height: 16%; transform: rotate(3deg); }
        .sp-blk.b3 { left: 78%; top: 20%; width: 14%; height: 22%; }
        .sp-blk.b4 { left: 34%; top: 34%; width: 12%; height: 18%; }
        .sp-blk.b5 { left: 60%; top: 40%; width: 18%; height: 14%; transform: rotate(-4deg); }
        .sp-blk.b6 { left: 10%; top: 70%; width: 20%; height: 16%; }
        .sp-grn { position: absolute; background: rgba(120,150,96,0.3); border: 1px solid rgba(90,120,70,0.32); }
        .sp-grn.gA { left: 50%; top: 30%; width: 30%; height: 30%; transform: rotate(2deg); }
        .sp-grn.gB { left: 80%; top: 64%; width: 14%; height: 20%; }
        .sp-site { position: absolute; left: 30%; top: 12%; width: 46%; height: 54%; border: 1.5px dashed #c0392b; transform: rotate(-4deg); }
        .sp-tag { position: absolute; left: 18px; bottom: 16px; font-size: 9px; color: #6a6a6a; background: rgba(255,255,255,0.72); padding: 5px 9px; }

        @media (max-width: 860px) {
          .pp-intro { grid-template-columns: 1fr; gap: 30px; }
          .pp-hero { height: 72vh; }
          .pp-figure, .pp-plan { height: 64vh; }
        }
      `}</style>
    </div>
  );
}
