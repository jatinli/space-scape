"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/projects";
import { useProjectViewer } from "./ProjectViewer";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const root = useRef<HTMLDivElement>(null);
  const { open } = useProjectViewer();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // section intro
      gsap.from(".work-head .reveal", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".work-head", start: "top 80%" },
      });

      if (reduce) {
        gsap.utils.toArray<HTMLElement>(".pj").forEach((el) => gsap.set(el, { opacity: 1 }));
        return;
      }

      gsap.utils.toArray<HTMLElement>(".pj").forEach((el) => {
        const img = el.querySelector(".pj-scene") as HTMLElement;
        const inner = el.querySelector(".scene") as HTMLElement;
        const meta = el.querySelectorAll(".pj-meta .reveal");

        // slow zoom 115% -> 100% while the frame travels through view
        gsap.fromTo(
          inner,
          { scale: 1.18 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
        // vertical parallax drift on the image
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
        // brightness: blur/dim while entering, sharp while centred
        gsap.fromTo(
          inner,
          { filter: "brightness(0.5) blur(6px)" },
          {
            filter: "brightness(1) blur(0px)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 35%", scrub: true },
          }
        );
        // text rises
        gsap.from(meta, {
          yPercent: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 70%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="featured" ref={root} className="work">
      <div className="work-head">
        <span className="reveal mono work-kick">In Focus — Selected Stories</span>
        <h2 className="reveal display work-title">Featured</h2>
      </div>

      {PROJECTS.filter((p) => p.featured).map((p) => (
        <article key={p.no} className={`pj pj-${p.align}`}>
          <button className="pj-scene" data-cursor data-cursor-label="Open" onClick={() => open(p)} aria-label={`Open ${p.name}`}>
            <div className={`scene ${p.scene}`} />
            <span className="pj-no mono">{p.no}</span>
          </button>
          <div className="pj-meta">
            <span className="reveal mono pj-cat">{p.category}</span>
            <h3 className="reveal display pj-name">{p.name}</h3>
            <span className="reveal mono pj-arch">Architecture · {p.architect}</span>
            <p className="reveal pj-desc">{p.desc}</p>
            <dl className="reveal pj-specs">
              <div><dt className="mono">Location</dt><dd>{p.location}</dd></div>
              <div><dt className="mono">Year</dt><dd>{p.year}</dd></div>
              <div><dt className="mono">Scale</dt><dd>{p.size}</dd></div>
              <div><dt className="mono">Visualisation</dt><dd>Space Scape</dd></div>
            </dl>
          </div>
        </article>
      ))}

      <style>{`
        .work { position: relative; padding: clamp(80px, 14vh, 170px) 0 clamp(40px, 8vh, 90px); }
        .work-head { max-width: 1500px; margin: 0 auto; padding: 0 clamp(18px, 4vw, 56px); }
        .work-kick { display: inline-block; font-size: 10px; color: var(--bronze); }
        .work-title { font-size: clamp(48px, 9vw, 132px); margin-top: 16px; color: var(--ink); }
        .reveal { display: inline-block; }
        .pj { position: relative; max-width: 1500px; margin: clamp(80px, 14vh, 180px) auto 0; padding: 0 clamp(18px, 4vw, 56px); display: grid; gap: clamp(28px, 5vw, 80px); align-items: center; }
        .pj-left { grid-template-columns: 1.5fr 1fr; }
        .pj-right { grid-template-columns: 1fr 1.5fr; }
        .pj-right .pj-meta { order: -1; }
        .pj-full { grid-template-columns: 1fr; }
        .pj-scene { position: relative; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; background: #070706; display: block; padding: 0; border: none; }
        .pj-full .pj-scene { aspect-ratio: 21 / 9; }
        .pj-scene .scene { will-change: transform, filter; }
        .pj-no { position: absolute; top: 16px; left: 18px; z-index: 4; font-size: 10px; color: rgba(236,233,228,0.7); }
        .pj-meta { display: flex; flex-direction: column; }
        .pj-full .pj-meta { flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; margin-top: 30px; gap: 24px; }
        .pj-cat { font-size: 10px; color: var(--bronze); }
        .pj-name { font-size: clamp(30px, 4.2vw, 64px); margin: 16px 0 10px; color: var(--ink); }
        .pj-arch { display: block; font-size: 10px; color: var(--mut); margin-bottom: 18px; }
        .pj-full .pj-name { margin: 16px 0 8px; flex: 1 1 320px; }
        .pj-desc { max-width: 42ch; font-size: clamp(15px, 1.3vw, 18px); line-height: 1.6; color: var(--ink); opacity: 0.72; font-weight: 300; }
        .pj-full .pj-desc { max-width: 46ch; }
        .pj-specs { display: flex; gap: clamp(26px, 4vw, 52px); margin-top: 28px; flex-wrap: wrap; }
        .pj-specs dt { font-size: 8.5px; color: var(--mut); margin-bottom: 6px; }
        .pj-specs dd { font-family: var(--font-mono); font-size: 12px; color: var(--ink); }
        @media (max-width: 860px) {
          .pj-left, .pj-right { grid-template-columns: 1fr; }
          .pj-right .pj-meta { order: 0; }
          .pj-scene, .pj-full .pj-scene { aspect-ratio: 3 / 2; }
          .pj-full .pj-meta { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </section>
  );
}
