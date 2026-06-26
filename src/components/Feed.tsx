"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/projects";
import { useProjectViewer } from "./ProjectViewer";

gsap.registerPlugin(ScrollTrigger);

/** A vertical image feed — scroll it like a feed. Hover credits the architect; click opens the project. */
export default function Feed() {
  const root = useRef<HTMLDivElement>(null);
  const { open } = useProjectViewer();

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

  return (
    <section id="work" ref={root} className="feed">
      {PROJECTS.map((p) => (
        <button
          key={p.no}
          className={`feed-item f-${p.span}`}
          data-cursor
          data-cursor-label="Open"
          onClick={() => open(p)}
          aria-label={`Open ${p.name} by ${p.architect}`}
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
      ))}

      <style>{`
        .feed {
          max-width: min(92vw, 590px); margin: 0 auto;
          padding: clamp(96px, 14vh, 150px) clamp(14px, 3vw, 28px) clamp(40px, 8vh, 90px);
          display: flex; flex-direction: column; gap: clamp(40px, 9vh, 120px);
        }
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
          .feed-item:hover .feed-cap { opacity: 1; transform: none; }
        }
        @media (hover: none) { .feed-cap { opacity: 1; transform: none; } }
      `}</style>
    </section>
  );
}
