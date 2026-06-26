"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, type Project } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

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

/* the right-hand panels: horizontal, drag on desktop / swipe on phone */
function RightStrip({ p }: { p: Project }) {
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = strip.current!;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
    el.classList.add("grabbing");
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    strip.current!.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const onUp = () => { drag.current.active = false; strip.current?.classList.remove("grabbing"); };

  return (
    <div className="dstrip" ref={strip} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
      <div className="dpanel dp-img"><div className={`scene ${p.sceneB}`} /></div>
      <div className="dpanel dp-text">
        <span className="mono d-kick">Description</span>
        <p className="d-body">{p.desc2}</p>
      </div>
      <div className="dpanel dp-plan"><SitePlan label={p.location} /></div>
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
        if (reduce) return;
        gsap.fromTo(
          item,
          { clipPath: "inset(6% 4% 6% 4%)", opacity: 0.4 },
          {
            clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
            ease: "power3.out", duration: 1.1,
            scrollTrigger: { trigger: item, start: "top 92%" },
          }
        );
        gsap.fromTo(
          img,
          { yPercent: -7 },
          { yPercent: 7, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 } }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 1100);
    return () => clearTimeout(t);
  }, [openNo]);

  return (
    <section id="work" ref={root} className="feed">
      {PROJECTS.map((p) => {
        const isOpen = openNo === p.no;
        return (
          <article key={p.no} className={`feed-block ${isOpen ? "open" : ""}`}>
            {/* LEFT — info / specs, beside the photo */}
            <div className="detail-left">
              <div className="dpanel dp-info">
                <span className="mono d-cat">{p.category}</span>
                <p className="d-lede">{p.desc}</p>
                <dl className="d-dl">
                  <div><dt className="mono">Architecture</dt><dd>{p.architect}</dd></div>
                  <div><dt className="mono">Visualisation</dt><dd>Space Scape</dd></div>
                  <div><dt className="mono">Year</dt><dd>{p.year}</dd></div>
                  <div><dt className="mono">Typology</dt><dd>{p.typology}</dd></div>
                  <div><dt className="mono">Scale</dt><dd>{p.size}</dd></div>
                  <div><dt className="mono">Status</dt><dd>{p.status}</dd></div>
                </dl>
              </div>
            </div>

            {/* CENTRE — the photo */}
            <button
              className={`feed-item f-${p.span}`}
              data-cursor
              data-cursor-label={isOpen ? "Close" : "Open"}
              onClick={() => setOpenNo(isOpen ? null : p.no)}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${p.name} by ${p.architect}`}
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

            {/* RIGHT — gallery, description, site plan */}
            <div className="detail-right">
              <RightStrip p={p} />
              <span className="d-hint mono" aria-hidden>Drag / swipe →</span>
            </div>
          </article>
        );
      })}

      <style>{`
        .feed {
          --gap: clamp(14px, 1.5vw, 26px);
          max-width: min(92vw, 560px); margin: 0 auto;
          padding: clamp(96px, 14vh, 150px) clamp(14px, 3vw, 28px) clamp(40px, 8vh, 90px);
          display: flex; flex-direction: column; gap: clamp(40px, 9vh, 120px);
        }
        .feed-block { position: relative; display: flex; flex-direction: column; }
        .feed-item {
          position: relative; width: 100%; overflow: hidden; background: #0b0a09;
          display: block; padding: 0; border: none; will-change: clip-path, opacity;
          transition: box-shadow .6s ease, transform .6s cubic-bezier(.16,1,.3,1);
        }
        .feed-block.open .feed-item { box-shadow: 0 26px 70px -28px rgba(0,0,0,.5); transform: translateY(-4px); }
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
          transition: opacity .4s ease, transform .5s cubic-bezier(.16,1,.3,1);
        }
        .feed-cap-row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
        .feed-name { font-size: clamp(20px, 2.2vw, 34px); color: #fff; }
        .feed-loc { font-size: 9px; color: rgba(255,255,255,0.65); white-space: nowrap; }
        .feed-arch { font-size: 9px; color: var(--bronze); letter-spacing: 0.16em; }
        @media (hover: hover) {
          .feed-item:hover .scene { transform: scale(1.05); }
          .feed-item:hover .feed-cap, .feed-block.open .feed-cap { opacity: 1; transform: none; }
        }
        @media (hover: none) { .feed-cap { opacity: 1; transform: none; } }

        /* ---- info unfolds to the LEFT of the photo, gallery to the RIGHT (both at photo level) ---- */
        .detail-left, .detail-right {
          position: absolute; top: 0; bottom: 0;
          width: calc(50vw - min(46vw, 280px) - var(--gap));
          pointer-events: none;
        }
        .detail-left { right: calc(100% + var(--gap)); display: flex; justify-content: flex-end; }
        .detail-right { left: calc(100% + var(--gap)); }
        .feed-block.open .detail-left, .feed-block.open .detail-right { pointer-events: auto; }

        .dstrip {
          height: 100%; display: flex; gap: clamp(10px, 1.1vw, 16px);
          overflow-x: auto; overflow-y: hidden; scroll-snap-type: x proximity;
          scrollbar-width: none; cursor: grab; touch-action: pan-x; padding-right: 3vw;
        }
        .dstrip::-webkit-scrollbar { display: none; }
        .dstrip.grabbing { cursor: grabbing; }

        /* napkin unfold — graceful hinge */
        .dpanel {
          flex: none; height: 100%; scroll-snap-align: start; overflow: hidden; position: relative;
          opacity: 0;
          transition: clip-path 1.2s cubic-bezier(.16,1,.3,1), opacity .85s ease,
                      transform 1.15s cubic-bezier(.16,1,.3,1);
        }
        /* right panels hinge from their left edge */
        .dp-img, .dp-text, .dp-plan { clip-path: inset(0 100% 0 0); transform: perspective(1100px) rotateY(-15deg); transform-origin: left center; }
        /* left info hinges from its right edge (toward the photo, opening left) */
        .dp-info { clip-path: inset(0 0 0 100%); transform: perspective(1100px) rotateY(15deg); transform-origin: right center; }
        .feed-block.open .dpanel { clip-path: inset(0 0 0 0); opacity: 1; transform: perspective(1100px) rotateY(0deg); }
        .feed-block.open .dp-info { transition-delay: .12s; }
        .feed-block.open .dp-img  { transition-delay: .30s; }
        .feed-block.open .dp-text { transition-delay: .50s; }
        .feed-block.open .dp-plan { transition-delay: .70s; }

        /* inner content also unfolds immersively: photos zoom-resolve, text rises */
        .dpanel .scene, .dpanel .sp { transition: transform 1.4s cubic-bezier(.16,1,.3,1); }
        .dp-img .scene, .dp-plan .sp { transform: scale(1.22); }
        .feed-block.open .dp-img .scene { transform: scale(1); transition-delay: .42s; }
        .feed-block.open .dp-plan .sp { transform: scale(1); transition-delay: .82s; }
        .dp-info > *, .dp-text > * { opacity: 0; transform: translateY(18px); transition: opacity .8s ease, transform .9s cubic-bezier(.16,1,.3,1); }
        .feed-block.open .dp-info > * { opacity: 1; transform: none; transition-delay: .34s; }
        .feed-block.open .dp-text > * { opacity: 1; transform: none; transition-delay: .78s; }

        .dp-info { width: min(100%, 320px); background: var(--bg-2); padding: clamp(18px,2.2vw,28px); display: flex; flex-direction: column; }
        .d-cat { font-size: 8.5px; color: var(--bronze); }
        .d-lede { font-size: clamp(15px,1.4vw,20px); line-height: 1.3; letter-spacing: -0.01em; color: var(--ink); margin: 10px 0 16px; }
        .d-dl { display: flex; flex-direction: column; margin-top: auto; }
        .d-dl > div { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; border-top: 1px solid var(--line-soft); }
        .d-dl dt { font-size: 8px; color: var(--mut); }
        .d-dl dd { font-family: var(--font-mono); font-size: 10px; color: var(--ink); text-align: right; }

        .dp-img { width: min(84vw, 480px); background: #0b0a09; }
        .dp-img .scene { position: absolute; inset: 0; }

        .dp-text { width: min(78vw, 360px); background: var(--bg-2); padding: clamp(18px,2.2vw,30px); display: flex; flex-direction: column; gap: 12px; justify-content: center; }
        .d-kick { font-size: 8.5px; color: var(--bronze); }
        .d-body { font-size: clamp(13px,1.2vw,16px); line-height: 1.65; color: var(--ink); }

        .dp-plan { width: min(84vw, 480px); }
        .dp-plan .sp { position: absolute; inset: 0; }

        .d-hint { position: absolute; right: 10px; bottom: 6px; z-index: 3; font-size: 8.5px; color: var(--mut); pointer-events: none; opacity: 0; transition: opacity .5s ease 1.2s; }
        .feed-block.open .d-hint { opacity: 1; }

        /* ---- site plan ---- */
        .sp { position: relative; background: #f1f0ec; overflow: hidden; }
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
        .sp-tag { position: absolute; left: 14px; bottom: 12px; font-size: 9px; color: #6a6a6a; background: rgba(255,255,255,0.72); padding: 5px 9px; }

        /* not enough room beside the photo -> stack below: info first, then the strip (swipeable) */
        @media (max-width: 1180px) {
          .detail-left, .detail-right {
            position: relative; left: auto; right: auto; width: 100%; top: auto; bottom: auto;
            height: 0; overflow: hidden; transition: height .7s cubic-bezier(.16,1,.3,1); display: block;
          }
          .feed-block.open .detail-left { height: auto; margin-top: 14px; }
          .feed-block.open .detail-right { height: clamp(210px, 44vh, 340px); margin-top: 12px; }
          .dp-info { width: 100%; }
        }
        @media (max-width: 620px) {
          .feed-block.open .detail-right { height: clamp(200px, 42vh, 300px); }
          .dp-text { width: 74vw; }
          .dp-img, .dp-plan { width: 82vw; }
        }
      `}</style>
    </section>
  );
}
