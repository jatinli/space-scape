"use client";

import { useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import HeroScene from "./HeroScene";

function scrollToWork() {
  const el = document.getElementById("work");
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (el && lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el?.scrollIntoView({ behavior: "smooth" });
}

const TITLE_TOP = "Photoreal imagery for".split(" ");
const TITLE_BIG = ["the", "unbuilt."];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.0, defaults: { ease: "power4.out" } });
      tl.to(".hero-canvas", { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
        .from(".hero-word .word", {
          yPercent: 120,
          opacity: 0,
          filter: "blur(12px)",
          rotation: 2,
          duration: 1.1,
          stagger: 0.08,
        }, 0.2)
        .from(".hero-sub", { y: 24, opacity: 0, duration: 1.0 }, "-=0.6")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.9 }, "-=0.7")
        .from(".hero-meta > *", { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.8")
        .from(".scrollcue", { opacity: 0, duration: 0.8 }, "-=0.4");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="hero">
      <div className="hero-canvas">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 1.2, 16], fov: 42 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="hero-veil" />

      <div className="hero-inner">
        <p className="hero-eyebrow mono">Architectural Visualisation</p>

        <h1 className="hero-title display">
          <span className="hero-word line-top">
            {TITLE_TOP.map((w, i) => (
              <span key={i} className="word-mask">
                <span className="word">{w}</span>
                {i < TITLE_TOP.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
          <span className="hero-word line-big">
            {TITLE_BIG.map((w, i) => (
              <span key={i} className="word-mask">
                <span className="word">{w}</span>
                {i < TITLE_BIG.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </h1>

        <p className="hero-sub">
          Space Scape produces 3D visualisation for architects and designers — the image
          of a space before it exists. The architecture is yours. We make it photographable.
        </p>

        <button className="hero-cta" data-cursor data-cursor-label="Enter" onClick={scrollToWork}>
          <span>View the Work</span>
          <i />
        </button>
      </div>

      <div className="hero-meta">
        <span className="mono">EST 2019</span>
        <span className="mono">PUNE · INDIA</span>
        <span className="mono">04 — DISCIPLINES</span>
      </div>

      <div className="scrollcue" aria-hidden>
        <span className="mono">SCROLL</span>
        <i />
      </div>

      <style>{`
        .hero { position: relative; height: 100svh; min-height: 640px; overflow: hidden; }
        .hero-canvas { position: absolute; inset: 0; z-index: 0; opacity: 0; }
        .hero-canvas canvas { display: block; }
        .hero-veil {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(240,238,233,0.05) 32%, rgba(255,255,255,0.86) 100%);
        }
        .hero-inner {
          position: absolute; z-index: 3; left: 0; right: 0; bottom: clamp(96px, 16vh, 190px);
          padding: 0 clamp(18px, 4vw, 56px); max-width: 1500px; margin: 0 auto;
        }
        .hero-eyebrow { font-size: 10px; color: var(--bronze); margin-bottom: clamp(20px, 4vh, 40px); }
        .hero-title { color: var(--ink); }
        .hero-word { display: block; }
        .line-top { font-size: clamp(26px, 4.4vw, 60px); font-weight: 400; color: var(--mut); letter-spacing: -0.02em; }
        .line-big { font-size: clamp(56px, 12vw, 168px); font-weight: 500; margin-top: 0.04em; }
        .hero-sub {
          max-width: 40ch; margin-top: clamp(22px, 4vh, 38px);
          font-size: clamp(15px, 1.4vw, 19px); line-height: 1.55; color: var(--ink); opacity: 0.82; font-weight: 300;
        }
        .hero-cta {
          display: inline-flex; align-items: center; gap: 14px; margin-top: clamp(28px, 5vh, 46px);
          background: none; border: none; color: var(--ink);
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
        }
        .hero-cta i { width: 54px; height: 1px; background: var(--ink); transition: width .5s cubic-bezier(.16,1,.3,1), background .4s; }
        .hero-cta:hover i { width: 86px; background: var(--bronze); }
        .hero-meta {
          position: absolute; z-index: 3; bottom: clamp(34px, 6vh, 54px); left: clamp(18px, 4vw, 56px); right: clamp(18px, 4vw, 56px);
          display: flex; gap: clamp(20px, 4vw, 64px); flex-wrap: wrap;
        }
        .hero-meta span { font-size: 9px; color: var(--mut); }
        .scrollcue { position: absolute; z-index: 3; right: clamp(18px, 4vw, 56px); bottom: clamp(96px, 16vh, 180px); display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .scrollcue span { font-size: 8px; color: var(--mut); writing-mode: vertical-rl; }
        .scrollcue i { width: 1px; height: 56px; background: linear-gradient(var(--bronze), transparent); animation: cue 2.4s ease-in-out infinite; }
        @keyframes cue { 0%,100% { transform: scaleY(.4); transform-origin: top; opacity: .4; } 50% { transform: scaleY(1); opacity: 1; } }
        @media (max-width: 720px) { .hero-meta span:last-child { display: none; } .scrollcue { display: none; } }
      `}</style>
    </section>
  );
}
