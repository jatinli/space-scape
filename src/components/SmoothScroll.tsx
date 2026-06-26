"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1.12,
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // velocity-driven minimize while scrolling, settles back when idle
    let scale = 1;
    const raf = (time: number) => {
      lenis.raf(time * 1000);
      const el = wrap.current;
      if (el) {
        const v = Math.abs((lenis as unknown as { velocity: number }).velocity || 0);
        const target = 1 - Math.min(v * 0.0095, 0.14);
        scale += (target - scale) * 0.11;
        if (Math.abs(scale - 1) < 0.0008) {
          scale = 1;
          if (el.style.transform) {
            el.style.transform = "";
            el.style.transformOrigin = "";
            el.style.borderRadius = "";
          }
        } else {
          const originY = window.scrollY + window.innerHeight / 2;
          el.style.transformOrigin = `50% ${originY}px`;
          el.style.transform = `scale(${scale})`;
          el.style.borderRadius = `${(1 - scale) * 320}px`;
        }
      }
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (wrap.current) wrap.current.style.transform = "";
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return (
    <div ref={wrap} className="scale-wrap" style={{ willChange: "transform", overflow: "hidden" }}>
      {children}
    </div>
  );
}
