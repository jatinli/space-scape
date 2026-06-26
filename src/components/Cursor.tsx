"use client";

import { useEffect, useRef } from "react";

/**
 * Minimal architectural crosshair cursor.
 * Lerps toward the pointer; enlarges over [data-cursor] elements and shows a
 * label when [data-cursor-label] is present.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    let hovering = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = !!el;
      if (next !== hovering) {
        hovering = next;
        ring.current?.classList.toggle("is-hover", hovering);
      }
      if (label.current) {
        const text = el?.getAttribute("data-cursor-label") ?? "";
        label.current.textContent = text;
        label.current.style.opacity = text ? "1" : "0";
      }
    };

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="cursor-root">
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <style>{`
        .cursor-root { position: fixed; inset: 0; z-index: 10000; pointer-events: none; }
        @media (hover: none), (pointer: coarse) { .cursor-root { display: none; } }
        .cursor-dot {
          position: fixed; top: 0; left: 0; width: 5px; height: 5px; border-radius: 50%;
          background: var(--bronze);
        }
        .cursor-ring {
          position: fixed; top: 0; left: 0; width: 26px; height: 26px; border-radius: 50%;
          border: 1px solid rgba(15,15,16,0.55);
          display: flex; align-items: center; justify-content: center;
          transition: width .35s cubic-bezier(.16,1,.3,1), height .35s cubic-bezier(.16,1,.3,1), background .35s, border-color .35s;
        }
        .cursor-ring::before, .cursor-ring::after {
          content: ""; position: absolute; background: rgba(15,15,16,0.55);
        }
        .cursor-ring::before { width: 1px; height: 8px; }
        .cursor-ring::after { height: 1px; width: 8px; }
        .cursor-ring.is-hover {
          width: 78px; height: 78px; background: rgba(182,137,91,0.12); border-color: rgba(182,137,91,0.7);
        }
        .cursor-ring.is-hover::before, .cursor-ring.is-hover::after { opacity: 0; }
        .cursor-label {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
          color: var(--ink); opacity: 0; transition: opacity .3s; white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
