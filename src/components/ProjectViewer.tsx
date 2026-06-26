"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/projects";

type Ctx = { open: (p: Project) => void };
const ViewerContext = createContext<Ctx>({ open: () => {} });
export const useProjectViewer = () => useContext(ViewerContext);

type Lenis = { stop: () => void; start: () => void };
const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

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

export function ProjectViewerProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const open = useCallback((p: Project) => setProject(p), []);
  const close = useCallback(() => setProject(null), []);

  useEffect(() => {
    if (!project) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const el = strip.current;
    if (el) el.scrollLeft = 0;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (!el) return;
      if (e.key === "ArrowRight") el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
      if (e.key === "ArrowLeft") el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
    };
    const onWheel = (e: WheelEvent) => {
      if (!el || window.innerWidth <= 880) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    window.addEventListener("keydown", onKey);
    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("wheel", onWheel);
    };
  }, [project, close]);

  const slide = (dir: number) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <ViewerContext.Provider value={{ open }}>
      {children}

      {mounted && project && createPortal(
        <div className="pv" role="dialog" aria-modal="true" aria-label={project.name}>
          <button className="pv-x mono" data-cursor onClick={close} aria-label="Close">Close ✕</button>
          <div className="pv-nav">
            <button className="pv-arrow" data-cursor onClick={() => slide(-1)} aria-label="Previous">‹</button>
            <button className="pv-arrow" data-cursor onClick={() => slide(1)} aria-label="Next">›</button>
          </div>

          <div className="pv-strip" ref={strip}>
            {/* PANEL 1 — meta + hero */}
            <section className="pv-panel p-hero">
              <aside className="pv-meta">
                <span className="pv-no mono">Project {project.no}</span>
                <h2 className="pv-name display">{project.name}</h2>
                <p className="pv-loc mono">{project.location}</p>
                <dl className="pv-dl">
                  <div><dt className="mono">Architecture</dt><dd>{project.architect}</dd></div>
                  <div><dt className="mono">Visualisation</dt><dd>Space Scape</dd></div>
                  <div><dt className="mono">Year</dt><dd>{project.year}</dd></div>
                  <div><dt className="mono">Typology</dt><dd>{project.typology}</dd></div>
                  <div><dt className="mono">Scale</dt><dd>{project.size}</dd></div>
                  <div><dt className="mono">Status</dt><dd>{project.status}</dd></div>
                </dl>
                <div className="pv-share mono"><span>Share</span><i>✉</i><i>f</i><i>in</i><i>𝕏</i></div>
              </aside>
              <figure className="pv-hero"><div className={`scene ${project.scene}`} /></figure>
              <div className="pv-intro">
                <p>{project.desc}</p>
                <span className="pv-hint mono">Scroll / slide right →</span>
              </div>
            </section>

            {/* PANEL 2 — description */}
            <section className="pv-panel p-desc">
              <figure className="pv-img"><div className={`scene ${project.sceneB}`} /></figure>
              <div className="pv-text">
                <span className="mono pv-kick">Description</span>
                <p className="pv-lede">{project.desc}</p>
                <p className="pv-body">{project.desc2}</p>
                <span className="pv-hint mono">Slide right for site plan →</span>
              </div>
            </section>

            {/* PANEL 3 — site plan */}
            <section className="pv-panel p-plan">
              <SitePlan label={project.location} />
            </section>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .pv { position: fixed; inset: 0; z-index: 9500; background: var(--bg); animation: pvf .3s ease; }
        @keyframes pvf { from { opacity: 0 } to { opacity: 1 } }
        .pv-x { position: fixed; top: 20px; right: clamp(18px,4vw,44px); z-index: 9600; font-size: 10px; color: var(--ink); border: 1px solid var(--line); background: var(--bg); padding: 9px 13px; }
        .pv-x:hover { background: var(--ink); color: var(--bg); }
        .pv-nav { position: fixed; bottom: 22px; right: clamp(18px,4vw,44px); z-index: 9600; display: flex; gap: 8px; }
        .pv-arrow { width: 46px; height: 46px; border: 1px solid var(--line); background: var(--bg); font-size: 20px; display: flex; align-items: center; justify-content: center; color: var(--ink); }
        .pv-arrow:hover { background: var(--ink); color: var(--bg); }

        .pv-strip { height: 100%; display: flex; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; }
        .pv-strip::-webkit-scrollbar { display: none; }
        .pv-panel { min-width: 100%; height: 100%; flex: none; scroll-snap-align: start; padding: clamp(80px,11vh,120px) clamp(20px,4vw,68px) clamp(80px,10vh,104px); }

        .p-hero { display: grid; grid-template-columns: 280px 1fr 320px; gap: clamp(22px,3vw,52px); align-items: center; }
        .pv-meta { display: flex; flex-direction: column; }
        .pv-no { font-size: 10px; color: var(--bronze); }
        .pv-name { font-size: clamp(28px,3vw,46px); margin: 14px 0 8px; color: var(--ink); }
        .pv-loc { font-size: 10px; color: var(--mut); margin-bottom: 28px; }
        .pv-dl { display: flex; flex-direction: column; }
        .pv-dl > div { display: flex; justify-content: space-between; gap: 18px; padding: 12px 0; border-top: 1px solid var(--line-soft); }
        .pv-dl > div:last-child { border-bottom: 1px solid var(--line-soft); }
        .pv-dl dt { font-size: 9px; color: var(--mut); }
        .pv-dl dd { font-family: var(--font-mono); font-size: 12px; color: var(--ink); text-align: right; }
        .pv-share { display: flex; align-items: center; gap: 8px; margin-top: 26px; }
        .pv-share span { font-size: 9px; color: var(--mut); margin-right: 4px; }
        .pv-share i { font-style: normal; width: 22px; height: 22px; background: var(--ink); color: var(--bg); font-size: 10px; display: flex; align-items: center; justify-content: center; }
        .pv-hero { position: relative; height: 100%; min-height: 320px; overflow: hidden; background: #0b0a09; }
        .pv-hero .scene { position: absolute; inset: 0; }
        .pv-intro { align-self: center; display: flex; flex-direction: column; gap: 22px; }
        .pv-intro p { font-size: clamp(15px,1.2vw,18px); line-height: 1.55; color: var(--ink); }
        .pv-hint { font-size: 9px; color: var(--mut); }

        .p-desc { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(24px,4vw,68px); align-items: center; }
        .pv-img { position: relative; height: 100%; min-height: 320px; overflow: hidden; background: #0b0a09; }
        .pv-img .scene { position: absolute; inset: 0; }
        .pv-text { display: flex; flex-direction: column; gap: 18px; max-width: 50ch; }
        .pv-kick { font-size: 10px; color: var(--bronze); }
        .pv-lede { font-size: clamp(18px,1.7vw,24px); line-height: 1.4; color: var(--ink); font-weight: 400; }
        .pv-body { font-size: clamp(14px,1.2vw,17px); line-height: 1.7; color: var(--mut); }

        .p-plan { display: flex; }
        .p-plan .sp { width: 100%; height: 100%; }

        .sp { position: relative; background: #f1f0ec; overflow: hidden; border: 1px solid var(--line-soft); }
        .sp::before { content: ""; position: absolute; inset: 0; background:
          repeating-linear-gradient(90deg, transparent 0 54px, rgba(15,15,16,0.045) 54px 55px),
          repeating-linear-gradient(0deg, transparent 0 54px, rgba(15,15,16,0.045) 54px 55px); }
        .sp-road { position: absolute; background: #fff; box-shadow: 0 0 0 1px rgba(15,15,16,0.07); }
        .sp-road.rh { left: 0; right: 0; top: 62%; height: 48px; }
        .sp-road.rv { top: 0; bottom: 0; left: 24%; width: 42px; transform: skewX(-12deg); }
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

        @media (max-width: 880px) {
          .pv-strip { flex-direction: column; overflow-x: hidden; overflow-y: auto; scroll-snap-type: y proximity; }
          .pv-panel { min-width: 100%; height: auto; padding: clamp(72px,12vh,96px) clamp(18px,5vw,40px) 44px; }
          .p-hero, .p-desc { grid-template-columns: 1fr; gap: 22px; }
          .pv-hero, .pv-img, .p-plan .sp { min-height: 64vw; height: 64vw; }
          .pv-nav { display: none; }
        }
      `}</style>
    </ViewerContext.Provider>
  );
}
