"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Black screen → logo + blueprint lines draw in → thin progress line →
 * everything dissolves to reveal the hero. No spinner.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => setGone(true),
      });

      if (reduce) {
        gsap.set(root.current, { autoAlpha: 0 });
        setGone(true);
        return;
      }

      tl.from(".ld-mark span", { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.05, ease: "power4.out" })
        .from(".ld-line-v", { scaleY: 0, duration: 0.7, transformOrigin: "top" }, "-=0.4")
        .from(".ld-line-h", { scaleX: 0, duration: 0.7, transformOrigin: "left" }, "<")
        .to(".ld-bar i", { scaleX: 1, duration: 1.05, ease: "power2.inOut" }, "-=0.3")
        .to(".ld-sub", { opacity: 1, duration: 0.4 }, "-=0.7")
        .to(".ld-inner", { opacity: 0, filter: "blur(8px)", duration: 0.6 }, "+=0.15")
        .to(root.current, { yPercent: -100, duration: 1.0, ease: "power4.inOut" }, "-=0.1");
    }, root);

    return () => ctx.revert();
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="ld">
      <div className="ld-grid">
        <span className="ld-line-v" style={{ left: "22%" }} />
        <span className="ld-line-v" style={{ left: "78%" }} />
        <span className="ld-line-h" style={{ top: "30%" }} />
        <span className="ld-line-h" style={{ top: "70%" }} />
      </div>
      <div className="ld-inner">
        <h1 className="ld-mark display">
          <span>S</span><span>P</span><span>A</span><span>C</span><span>E</span>
          <span className="ld-gap">&nbsp;</span>
          <span>S</span><span>C</span><span>A</span><span>P</span><span>E</span>
        </h1>
        <div className="ld-bar"><i /></div>
        <p className="ld-sub mono">Architectural Visualisation</p>
      </div>

      <style>{`
        .ld { position: fixed; inset: 0; z-index: 11000; background: #f4f3f1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .ld-grid { position: absolute; inset: 0; }
        .ld-line-v { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(15,15,16,0.08); }
        .ld-line-h { position: absolute; left: 0; right: 0; height: 1px; background: rgba(15,15,16,0.08); }
        .ld-inner { position: relative; text-align: center; }
        .ld-mark { font-size: clamp(34px, 7vw, 88px); color: var(--ink); display: flex; justify-content: center; }
        .ld-mark span { display: inline-block; }
        .ld-gap { width: .4em; }
        .ld-bar { width: min(280px, 60vw); height: 1px; background: rgba(15,15,16,0.14); margin: 30px auto 0; overflow: hidden; }
        .ld-bar i { display: block; height: 100%; width: 100%; background: var(--bronze); transform: scaleX(0); transform-origin: left; }
        .ld-sub { margin-top: 20px; font-size: 10px; color: var(--mut); opacity: 0; }
      `}</style>
    </div>
  );
}
