"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, type Project } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

/* light CSS site-plan placeholder */
function SitePlan({ label }: { label: string }) {
  return (
    <div className="sp" role="img" aria-label={`Site plan, ${label}`}>
      <span className="sp-road rh" />
      <span className="sp-road rv" />
      <span className="sp-blk b1" /><span className="sp-blk b2" /><span className="sp-blk b3" />
      <span className="sp-blk b4" /><span className="sp-blk b5" /><span className="sp-blk b6" />
      <span className="sp-grn gA" /><span className="sp-grn gB" />
      <span className="sp-site" />
      <span className="sp-tag mono">SITE PLAN · {label}</span>
    </div>
  );
}

/* horizontal, drag-scrollable detail strip shown inline under a project */
function DetailStrip({ p, onClose }: { p: Project; onClose: () => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // touch uses native horizontal scroll
    const el = strip.current!;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    el.classList.add("grabbing");
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const el = strip.current!;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const onUp = () => {
    drag.current.active = false;
    strip.current?.classList.remove("grabbing");
  };
  const by = (dir: number) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="dt">
      <div className="dt-bar">
        <span className="mono dt-hint">Drag ← → or use arrows</span>
        <div className="dt-ctrls">
          <button className="dt-arrow" data-cursor onClick={() => by(-1)} aria-label="Scroll left">‹</button>
          <button className="dt-arrow" data-cursor onClick={() => by(1)} aria-label="Scroll right">›</button>
          <button className="dt-close mono" data-cursor onClick={onClose} aria-label="Close">Close ✕</button>
        </div>
      </div>

      <div
        className="dt-strip"
        ref={strip}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <section className="dt-panel dt-info">
          <span className="mono dt-cat">{p.category}</span>
          <h3 className="display dt-name">{p.name}</h3>
          <dl className="dt-dl">
            <div><dt className="mono">Architecture</dt><dd>{p.architect}</dd></div>
            <div><dt className="mono">Visualisation</dt><dd>Space Scape</dd></div>
            <div><dt className="mono">Location</dt><dd>{p.location}</dd></div>
            <div><dt className="mono">Year</dt><dd>{p.year}</dd></div>
            <div><dt className="mono">Typology</dt><dd>{p.typology}</dd></div>
            <div><dt className="mono">Scale</dt><dd>{p.size}</dd></div>
            <div><dt className="mono">Status</dt><dd>{p.status}</dd></div>
          </dl>
          <p className="dt-desc">{p.desc}</p>
        </section>

        <section className="dt-panel dt-image"><div className={`scene ${p.sceneB}`} /></section>

        <section className="dt-panel dt-text">
          <span className="mono dt-kick">Description</span>
          <p className="dt-body">{p.desc2}</p>
        </section>

        <section className="dt-panel dt-plan"><SitePlan label={p.location} /></section>
      </div>
    </div>
  );
}

export default function Feed() {
  const root = useRef<HTMLDivElement>(null);
  const [openNo, setOpenNo] = useState<string | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feed-item").forEach((item) => {
        const img = item.querySelector(".scene") as HTMLElement;
        if (!reduce) {
          gsap.fromTo(
            item,
            { clipPath: "inset(6% 4% 6% 4%)", opacity: 0.4 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              ease: "power3.out",
              duration: 1.1,
              scrollTrigger: { trigger: item, start: "top 92%" },
            }
          );
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // re-measure scroll positions after a panel opens/closes
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 680);
    return () => clearTimeout(t);
  }, [openNo]);

  return (
    <section id="work" ref={root} className="feed">
      {PROJECTS.map((p) => {
        const isOpen = openNo === p.no;
        return (
          <div className="feed-block" key={p.no}>
            <button
              className={`feed-item f-${p.span} ${isOpen ? "active" : ""}`}
              data-cursor
              data-cursor-label={isOpen ? "Close" : "Open"}
              onClick={() => setOpenNo(isOpen ? null : p.no)}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? "Close" : "Open"} ${p.name} by ${p.architect}`}
            >
              <div className={`scene ${p.scene}`} />
              <span className="feed-no mono">{p.no}</span>
              <div className="feed-cap">
                <div className="feed-cap-row">
                  <span className="feed-name display">{p.name}</span>
                  <span className="feed-loc mono">{p.location}</span>
                </div>
                <span className="feed-arch mono">Architecture · {p.architect}</span>
              </div>
            </button>

            <div className={`detail-wrap ${isOpen ? "open" : ""}`}>
              <DetailStrip p={p} onClose={() => setOpenNo(null)} />
            </div>
          </div>
        );
      })}

      <style>{`
        .feed {
          max-width: min(92vw, 590px); margin: 0 auto;
          padding: clamp(96px, 14vh, 150px) clamp(14px, 3vw, 28px) clamp(40px, 8vh, 90px);
          display: flex; flex-direction: column; gap: clamp(40px, 9vh, 120px);
        }
        .feed-block { display: flex; flex-direction: column; }
        .feed-item {
          position: relative; width: 100%; overflow: hidden; background: #0b0a09;
          display: block; padding: 0; border: none; will-change: clip-path, opacity;
        }
        .f-std { aspect-ratio: 3 / 2; }
        .f-wide { aspect-ratio: 16 / 9; }
        .f-tall { aspect-ratio: 4 / 5; }
        .feed-item .scene { width: 100%; height: 114%; top: -7%; transition: transform 1.2s cubic-bezier(.16,1,.3,1); }
        .feed-no { position: absolute; top: 16px; left: 18px; z-index: 4; font-size: 9px; color: rgba(255,255,255,0.7); }
        .feed-cap {
          position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; padding: clamp(16px, 1.6vw, 26px);
          display: flex; flex-direction: column; gap: 8px;
          background: linear-gradient(to top, rgba(8,8,9,0.8), rgba(8,8,9,0) 100%);
          opacity: 0; transform: translateY(12px);
          transition: opacity .45s ease, transform .55s cubic-bezier(.16,1,.3,1);
        }
        .feed-cap-row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
        .feed-name { font-size: clamp(20px, 2.2vw, 34px); color: #fff; }
        .feed-loc { font-size: 9px; color: rgba(255,255,255,0.65); white-space: nowrap; }
        .feed-arch { font-size: 9px; color: var(--bronze); letter-spacing: 0.16em; }
        @media (hover: hover) {
          .feed-item:hover .scene { transform: scale(1.05); }
          .feed-item:hover .feed-cap, .feed-item.active .feed-cap { opacity: 1; transform: none; }
        }
        @media (hover: none) { .feed-cap { opacity: 1; transform: none; } }

        /* ---- inline expandable detail ---- */
        .detail-wrap { height: 0; overflow: hidden; transition: height .6s cubic-bezier(.16,1,.3,1); }
        .detail-wrap.open { height: clamp(460px, 76vh, 720px); margin-top: 14px; }

        .dt { height: 100%; display: flex; flex-direction: column; }
        .dt-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 2px 12px; }
        .dt-hint { font-size: 9px; color: var(--mut); }
        .dt-ctrls { display: flex; gap: 8px; align-items: center; }
        .dt-arrow { width: 34px; height: 34px; border: 1px solid var(--line); background: var(--bg); color: var(--ink); font-size: 18px; display: flex; align-items: center; justify-content: center; }
        .dt-arrow:hover { background: var(--ink); color: var(--bg); }
        .dt-close { border: 1px solid var(--line); padding: 8px 11px; font-size: 9px; color: var(--ink); }
        .dt-close:hover { background: var(--ink); color: var(--bg); }

        .dt-strip {
          flex: 1; display: flex; gap: clamp(12px, 1.6vw, 22px);
          overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory;
          scrollbar-width: none; cursor: grab; touch-action: pan-x;
        }
        .dt-strip::-webkit-scrollbar { display: none; }
        .dt-strip.grabbing { cursor: grabbing; }
        .dt-panel { flex: none; height: 100%; scroll-snap-align: start; overflow: hidden; }
        .dt-info { width: min(92%, 560px); background: var(--bg-2); padding: clamp(22px, 3vw, 40px); display: flex; flex-direction: column; overflow-y: auto; }
        .dt-cat { font-size: 9px; color: var(--bronze); }
        .dt-name { font-size: clamp(24px, 3vw, 40px); margin: 12px 0 18px; color: var(--ink); }
        .dt-dl { display: grid; grid-template-columns: 1fr; }
        .dt-dl > div { display: flex; justify-content: space-between; gap: 16px; padding: 9px 0; border-top: 1px solid var(--line-soft); }
        .dt-dl > div:last-child { border-bottom: 1px solid var(--line-soft); }
        .dt-dl dt { font-size: 8.5px; color: var(--mut); }
        .dt-dl dd { font-family: var(--font-mono); font-size: 11px; color: var(--ink); text-align: right; }
        .dt-desc { margin-top: 18px; font-size: clamp(14px, 1.1vw, 16px); line-height: 1.55; color: var(--mut); }

        .dt-image { width: min(92%, 760px); position: relative; background: #0b0a09; }
        .dt-image .scene { position: absolute; inset: 0; }

        .dt-text { width: min(92%, 620px); background: var(--bg-2); padding: clamp(22px, 3vw, 44px); display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
        .dt-kick { font-size: 9px; color: var(--bronze); }
        .dt-body { font-size: clamp(15px, 1.3vw, 19px); line-height: 1.7; color: var(--ink); }

        .dt-plan { width: min(92%, 760px); }
        .dt-plan .sp { width: 100%; height: 100%; }

        .sp { position: relative; background: #f1f0ec; overflow: hidden; border: 1px solid var(--line-soft); }
        .sp::before { content: ""; position: absolute; inset: 0; background:
          repeating-linear-gradient(90deg, transparent 0 48px, rgba(15,15,16,0.045) 48px 49px),
          repeating-linear-gradient(0deg, transparent 0 48px, rgba(15,15,16,0.045) 48px 49px); }
        .sp-road { position: absolute; background: #fff; box-shadow: 0 0 0 1px rgba(15,15,16,0.07); }
        .sp-road.rh { left: 0; right: 0; top: 62%; height: 42px; }
        .sp-road.rv { top: 0; bottom: 0; left: 24%; width: 38px; transform: skewX(-12deg); }
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
        .sp-tag { position: absolute; left: 16px; bottom: 14px; font-size: 9px; color: #6a6a6a; background: rgba(255,255,255,0.72); padding: 5px 9px; }

        @media (max-width: 620px) {
          .detail-wrap.open { height: clamp(420px, 70vh, 560px); }
          .dt-info, .dt-text, .dt-image, .dt-plan { width: 90%; }
        }
      `}</style>
    </section>
  );
}
