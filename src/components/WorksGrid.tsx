"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/projects";
import { useProjectViewer } from "./ProjectViewer";

gsap.registerPlugin(ScrollTrigger);

/** Image-first works grid (Brick Visual feel): the architect's work leads, hover credits them. */
export default function WorksGrid() {
  const root = useRef<HTMLDivElement>(null);
  const { open } = useProjectViewer();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".wg-head .reveal", {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".wg-head", start: "top 82%" },
      });
      gsap.utils.toArray<HTMLElement>(".wg-tile").forEach((tile) => {
        const img = tile.querySelector(".scene") as HTMLElement;
        gsap.fromTo(
          tile,
          { y: 60, opacity: 0, clipPath: "inset(8% 8% 8% 8%)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: tile, start: "top 88%" },
          }
        );
        // slow internal parallax
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={root} className="wg">
      <div className="wg-head">
        <span className="reveal mono wg-kick">Selected Work · {PROJECTS.length} Projects</span>
        <h2 className="reveal display wg-title">Works</h2>
      </div>

      <div className="wg-grid">
        {PROJECTS.map((p) => (
          <button
            key={p.no}
            className={`wg-tile wg-${p.span}`}
            data-cursor
            data-cursor-label="Open"
            onClick={() => open(p)}
            aria-label={`Open ${p.name} by ${p.architect}`}
          >
            <div className={`scene ${p.scene}`} />
            <span className="wg-no mono">{p.no}</span>
            <div className="wg-cap">
              <div className="wg-cap-row">
                <span className="wg-name display">{p.name}</span>
                <span className="wg-loc mono">{p.location}</span>
              </div>
              <span className="wg-arch mono">Architecture · {p.architect}</span>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .wg { max-width: 1640px; margin: 0 auto; padding: clamp(70px, 12vh, 150px) clamp(18px, 4vw, 56px) 0; }
        .wg-head { margin-bottom: clamp(34px, 6vh, 64px); }
        .wg-kick { display: inline-block; font-size: 10px; color: var(--bronze); }
        .wg-title { font-size: clamp(44px, 8vw, 120px); margin-top: 14px; color: var(--ink); }
        .reveal { display: inline-block; }

        .wg-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: clamp(10px, 1.4vw, 22px); grid-auto-flow: dense; }
        .wg-tile {
          position: relative; overflow: hidden; background: #0b0a09; display: block; padding: 0; border: none;
          grid-column: span 2; aspect-ratio: 4 / 3; will-change: transform, clip-path;
        }
        .wg-std { grid-column: span 2; aspect-ratio: 4 / 3; }
        .wg-tall { grid-column: span 2; aspect-ratio: 3 / 4; }
        .wg-wide { grid-column: span 4; aspect-ratio: 16 / 9; }
        .wg-tile .scene { width: 100%; height: 112%; top: -6%; transition: transform 1.1s cubic-bezier(.16,1,.3,1), filter .6s; }
        .wg-no { position: absolute; top: 14px; left: 16px; z-index: 4; font-size: 9px; color: rgba(255,255,255,0.7); }
        .wg-cap {
          position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; padding: clamp(14px, 1.4vw, 22px);
          display: flex; flex-direction: column; gap: 7px;
          background: linear-gradient(to top, rgba(8,8,9,0.78), rgba(8,8,9,0) 100%);
          opacity: 0; transform: translateY(10px); transition: opacity .45s ease, transform .55s cubic-bezier(.16,1,.3,1);
        }
        .wg-cap-row { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; }
        .wg-name { font-size: clamp(18px, 1.7vw, 26px); color: #fff; }
        .wg-loc { font-size: 9px; color: rgba(255,255,255,0.65); white-space: nowrap; }
        .wg-arch { font-size: 9px; color: var(--bronze); letter-spacing: 0.16em; }
        @media (hover: hover) {
          .wg-tile:hover .scene { transform: scale(1.06); }
          .wg-tile:hover .wg-cap { opacity: 1; transform: none; }
        }
        @media (hover: none) { .wg-cap { opacity: 1; transform: none; } }
        @media (max-width: 1000px) {
          .wg-grid { grid-template-columns: repeat(4, 1fr); }
          .wg-std, .wg-tall { grid-column: span 2; }
          .wg-wide { grid-column: span 4; }
        }
        @media (max-width: 620px) {
          .wg-grid { grid-template-columns: 1fr; gap: 12px; }
          .wg-std, .wg-tall, .wg-wide { grid-column: span 1; aspect-ratio: 4 / 3; }
        }
      `}</style>
    </section>
  );
}
