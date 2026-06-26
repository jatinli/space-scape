"use client";

import { useEffect, useRef, useState } from "react";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      setHidden(y > 240 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: [string, string][] = [
    ["Work", "work"],
    ["Contact", "contact"],
  ];

  return (
    <>
      <header className={`nav ${solid ? "solid" : ""} ${hidden ? "hide" : ""}`}>
        <button
          className="nav-logo display"
          data-cursor
          onClick={() => scrollTo("top")}
          aria-label="Space Scape, to top"
        >
          SPACE<span>SCAPE</span>
        </button>

        <nav className="nav-links">
          {links.map(([label, id]) => (
            <button key={id} className="nav-link mono" data-cursor onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
        </nav>

        <button className="nav-burger" data-cursor onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <i /><i />
        </button>
      </header>

      <div className={`nav-overlay ${open ? "open" : ""}`}>
        {links.map(([label, id], i) => (
          <button
            key={id}
            className="nav-ov-link display"
            style={{ transitionDelay: `${0.08 * i + 0.1}s` }}
            onClick={() => {
              setOpen(false);
              scrollTo(id);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 7000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 26px clamp(18px, 4vw, 56px);
          transition: transform .6s cubic-bezier(.16,1,.3,1), background .5s, padding .5s, opacity .5s;
          mix-blend-mode: difference;
        }
        .nav.solid { padding-top: 18px; padding-bottom: 18px; }
        /* logo always stays; only the links tuck away on scroll-down */
        .nav-links, .nav-burger { transition: opacity .5s, transform .5s cubic-bezier(.16,1,.3,1); }
        .nav.hide .nav-links, .nav.hide .nav-burger { opacity: 0; transform: translateY(-14px); pointer-events: none; }
        .nav-logo { font-size: clamp(15px, 1.5vw, 18px); font-weight: 600; color: #fff; letter-spacing: -0.01em; }
        .nav-logo span { margin-left: .22em; }
        .nav-links { display: flex; gap: clamp(20px, 2.4vw, 46px); }
        .nav-link { font-size: 11px; color: #fff; opacity: .82; transition: opacity .3s; background: none; border: none; }
        .nav-link:hover { opacity: 1; }
        .nav-burger { display: none; flex-direction: column; gap: 6px; background: none; border: none; }
        .nav-burger i { width: 24px; height: 1.5px; background: #fff; display: block; }
        @media (max-width: 720px) {
          .nav-links { display: none; }
          .nav-burger { display: flex; }
        }
        .nav-overlay {
          position: fixed; inset: 0; z-index: 6900; background: rgba(255,255,255,0.97);
          backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; opacity: 0; pointer-events: none; transition: opacity .5s;
        }
        .nav-overlay.open { opacity: 1; pointer-events: auto; }
        .nav-ov-link {
          font-size: clamp(40px, 12vw, 92px); color: var(--ink); background: none; border: none;
          opacity: 0; transform: translateY(30px); transition: opacity .6s, transform .6s; font-weight: 500; letter-spacing: -0.03em;
        }
        .nav-overlay.open .nav-ov-link { opacity: 1; transform: none; }
      `}</style>
    </>
  );
}
