"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/projects";
import { useProjectViewer } from "./ProjectViewer";

gsap.registerPlugin(ScrollTrigger);

/** Pinned section: vertical scroll drives a horizontal museum-style filmstrip. */
export default function HorizontalGallery() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { open } = useProjectViewer();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const el = track.current!;
      const getScroll = () => el.scrollWidth - window.innerWidth;

      const tween = gsap.to(el, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + getScroll(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // each frame: parallax the inner image + fade title between slides
      gsap.utils.toArray<HTMLElement>(".hg-frame").forEach((frame) => {
        const inner = frame.querySelector(".scene") as HTMLElement;
        gsap.fromTo(
          inner,
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hg">
      <div ref={track} className="hg-track">
        <div className="hg-intro">
          <span className="mono hg-kick">The Exhibition</span>
          <h2 className="display hg-title">
            Every scroll<br />reveals another<br /><em>masterpiece.</em>
          </h2>
          <span className="mono hg-hint">Scroll →</span>
        </div>

        {PROJECTS.map((p) => (
          <figure
            key={p.no}
            className="hg-frame"
            data-cursor
            data-cursor-label="Open"
            onClick={() => open(p)}
          >
            <div className={`scene ${p.scene}`} />
            <figcaption className="hg-cap">
              <span className="mono">{p.no} — {p.location}</span>
              <span className="display hg-cap-name">{p.name}</span>
            </figcaption>
          </figure>
        ))}

        <div className="hg-end">
          <span className="mono">End of selected work</span>
        </div>
      </div>

      <style>{`
        .hg { position: relative; background: var(--bg-2); overflow: hidden; }
        .hg-track { display: flex; align-items: center; height: 100svh; width: max-content; padding: 0 clamp(18px, 4vw, 56px); gap: clamp(24px, 4vw, 64px); will-change: transform; }
        .hg-intro { flex: none; width: min(78vw, 560px); }
        .hg-kick { font-size: 10px; color: var(--bronze); }
        .hg-title { font-size: clamp(36px, 6vw, 86px); margin-top: 18px; color: var(--ink); }
        .hg-title em { color: var(--bronze); font-style: normal; }
        .hg-hint { display: inline-block; margin-top: 30px; font-size: 10px; color: var(--mut); }
        .hg-frame { position: relative; flex: none; width: clamp(320px, 56vw, 760px); height: 70svh; overflow: hidden; background: #070706; }
        .hg-frame .scene { width: 120%; left: -10%; }
        .hg-cap { position: absolute; left: 20px; bottom: 20px; z-index: 4; display: flex; flex-direction: column; gap: 8px; }
        .hg-cap .mono { font-size: 9px; color: rgba(236,233,228,0.7); }
        .hg-cap-name { font-size: clamp(22px, 2.4vw, 34px); color: var(--ink); }
        .hg-end { flex: none; width: 40vw; display: flex; align-items: center; }
        .hg-end .mono { font-size: 10px; color: var(--faint); }
        @media (max-width: 720px) { .hg-frame { width: 78vw; height: 60svh; } }
      `}</style>
    </section>
  );
}
