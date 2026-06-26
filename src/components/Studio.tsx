"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Studio() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".st-stmt .word", {
        yPercent: 110,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".st-stmt", start: "top 78%" },
      });
      gsap.from(".st-row", {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".st-grid", start: "top 80%" },
      });
      gsap.from(".st-svc li", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".st-svc", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const stmt = "We don't design the building. We make its first photograph.".split(" ");

  return (
    <section id="studio" ref={root} className="st">
      <span className="mono st-kick">The Role</span>

      <h2 className="st-stmt display">
        {stmt.map((w, i) => (
          <span key={i} className="word-mask">
            <span className="word">{w}</span>
            {i < stmt.length - 1 ? " " : ""}
          </span>
        ))}
      </h2>

      <div className="st-grid">
        <p className="st-row st-lede">
          Space Scape is a 3D visualisation studio working alongside architects and designers.
          Every project here is someone else&apos;s building — we only make the image. The credit,
          and the design, stays with the studio that drew it.
        </p>
        <ul className="st-row st-svc">
          <li><span>Still Imagery</span><i>Photoreal stills · interior &amp; exterior</i></li>
          <li><span>Cinematic Film</span><i>Animation &amp; motion sequences</i></li>
          <li><span>Concept &amp; Art Direction</span><i>Mood · framing · light strategy</i></li>
        </ul>
      </div>

      <p className="st-credit mono">
        Visualisation by Space Scape · Architecture credited to each studio
      </p>

      <style>{`
        .st { max-width: 1500px; margin: 0 auto; padding: clamp(100px, 18vh, 200px) clamp(18px, 4vw, 56px) 0; }
        .st-kick { font-size: 10px; color: var(--bronze); }
        .st-stmt { font-size: clamp(28px, 5vw, 70px); margin-top: 22px; max-width: 20ch; color: var(--ink); }
        .st-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(30px, 6vw, 96px); margin-top: clamp(50px, 9vh, 96px); align-items: start; }
        .st-lede { font-size: clamp(15px, 1.4vw, 19px); line-height: 1.7; color: var(--mut); max-width: 50ch; }
        .st-svc { list-style: none; }
        .st-svc li { display: flex; flex-direction: column; gap: 5px; padding: 18px 0; border-top: 1px solid var(--line); }
        .st-svc li:last-child { border-bottom: 1px solid var(--line); }
        .st-svc span { font-size: 20px; font-weight: 500; color: var(--ink); letter-spacing: -0.01em; }
        .st-svc i { font-family: var(--font-mono); font-style: normal; font-size: 11px; letter-spacing: 0.06em; color: var(--mut); }
        .st-credit { margin-top: clamp(40px, 7vh, 80px); font-size: 9px; color: var(--faint); }
        @media (max-width: 860px) { .st-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
