import React, { useState, useEffect, useRef, useCallback } from "react";

/*
  SPACE SCAPE VISUALISATIONS — single-page archviz studio site.

  NOTE ON IMAGERY: every "render" below is an atmospheric CSS placeholder
  (the .scene divs). To make this real, replace each <div className="scene ..">
  with an <img src="your-render.jpg" .. /> — the layout, framing marks, and
  metadata are already built to hold real photoreal stills.
*/

const PROJECTS = [
  {
    no: "001",
    name: "Forest Residence",
    location: "Aspen, Colorado",
    client: "Hølm Architecture",
    year: "2025",
    caption: "EXT · DUSK · 32MM",
    desc:
      "A glass house held between pines. We chased the last warm light through the trees until the interior began to glow on its own.",
    scene: "s1",
    sceneB: "s1b",
  },
  {
    no: "002",
    name: "Urban Loft",
    location: "Berlin, DE",
    client: "Atelier Voss",
    year: "2025",
    caption: "INT · NIGHT · 24MM",
    desc:
      "Concrete, steel and a single low lamp. The city stays outside; the room keeps everything that matters close.",
    scene: "s2",
    sceneB: "s2b",
  },
  {
    no: "003",
    name: "Coastal Retreat",
    location: "Amalfi, IT",
    client: "Marin + Co",
    year: "2024",
    caption: "EXT · GOLDEN · 50MM",
    desc:
      "A terrace that gives way to nothing but sea. Built to be photographed in the ten minutes before the sun lets go.",
    scene: "s3",
    sceneB: "s3b",
  },
  {
    no: "004",
    name: "Museum Atrium",
    location: "Lisbon, PT",
    client: "Praxis Studio",
    year: "2024",
    caption: "INT · DAY · 20MM",
    desc:
      "Light falls five storeys before it reaches the floor. We let the silence of the volume do the work.",
    scene: "s4",
    sceneB: "s4b",
  },
  {
    no: "005",
    name: "Private Villa",
    location: "Mumbai, IN",
    client: "Verma Associates",
    year: "2025",
    caption: "EXT · TWILIGHT · 35MM",
    desc:
      "Water, warm stone, and a pool that holds the sky after dark. A house seen the way its owners will remember it.",
    scene: "s5",
    sceneB: "s5b",
  },
  {
    no: "006",
    name: "Boutique Hotel",
    location: "Kyoto, JP",
    client: "Nakamura Design",
    year: "2023",
    caption: "INT · DUSK · 28MM",
    desc:
      "A lobby measured in shadow. Timber, paper light and the quiet of a room that asks you to lower your voice.",
    scene: "s6",
    sceneB: "s6b",
  },
];

const PROCESS = [
  ["01", "Concept", "We read the drawings and find the image inside them — the single frame the building wants to be seen in."],
  ["02", "Lighting", "Time of day is a design decision. We light for mood before we light for accuracy."],
  ["03", "Materials", "Every surface is built to behave like the real thing under that exact light."],
  ["04", "Composition", "The camera is placed the way a photographer would place it — never the way a model exports it."],
  ["05", "Final Imagery", "Grading, atmosphere, and the quiet details that make an unbuilt room feel remembered."],
];

/* ---- framing marks drawn over every render ---- */
function FrameMarks({ no, caption, coord }) {
  return (
    <div className="marks" aria-hidden="true">
      <span className="reg tl" />
      <span className="reg tr" />
      <span className="reg bl" />
      <span className="reg br" />
      <span className="m-no">{no}</span>
      <span className="m-coord">{coord}</span>
      <span className="m-cap">{caption}</span>
      <span className="scalebar">
        <i /><i /><i /><i /><i />
      </span>
    </div>
  );
}

function Reveal({ children, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export default function App() {
  const [open, setOpen] = useState(null); // project index or null
  const [navSolid, setNavSolid] = useState(false);
  const heroSceneRef = useRef(null);
  const closeBtnRef = useRef(null);

  /* hero parallax + nav state */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setNavSolid(y > 40);
        if (heroSceneRef.current) {
          heroSceneRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
        }
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lightbox: lock scroll, esc to close, focus */
  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const go = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const p = open !== null ? PROJECTS[open] : null;

  return (
    <div className="ss">
      <style>{CSS}</style>

      {/* NAV */}
      <header className={`nav ${navSolid ? "solid" : ""}`}>
        <button className="brand" onClick={() => go("top")} aria-label="Space Scape, back to top">
          <span className="brand-name">SPACE SCAPE</span>
          <span className="brand-sub">VISUALISATIONS</span>
        </button>
        <nav className="links">
          <a onClick={() => go("projects")}>Projects</a>
          <a onClick={() => go("process")}>Process</a>
          <a onClick={() => go("studio")}>Studio</a>
          <a onClick={() => go("contact")}>Contact</a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="hero">
        <div className="hero-scene-wrap">
          <div ref={heroSceneRef} className="scene hero-scene s0" />
          <div className="hero-veil" />
        </div>
        <FrameMarks no="00" caption="EST · 2019 · ƒ8" coord="18.5204°N  73.8567°E" />
        <div className="hero-inner">
          <h1 className="hero-title">
            <span className="ln l1">Space</span>
            <span className="ln l2">Scape</span>
          </h1>
          <span className="hero-mono">VISUALISATIONS</span>
          <p className="hero-lede">
            Photorealistic architectural imagery and cinematic visualisation for
            architecture, interiors, and development.
          </p>
          <button className="cta" onClick={() => go("projects")}>
            <span>View Projects</span>
            <span className="cta-rule" />
          </button>
        </div>
        <div className="scrollcue" aria-hidden="true">
          <span>SCROLL</span>
          <i />
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects">
        <Reveal className="sec-head">
          <span className="eyebrow">01 — Selected Work</span>
          <h2 className="sec-title">Projects</h2>
        </Reveal>

        {PROJECTS.map((proj, i) => (
          <Reveal
            key={proj.no}
            className={`project ${i % 2 === 1 ? "alt" : ""} ${i % 3 === 0 ? "wide" : ""}`}
          >
            <button
              className="frame"
              onClick={() => setOpen(i)}
              aria-label={`Open ${proj.name}`}
            >
              <div className={`scene ${proj.scene}`} />
              <div className={`scene shift ${proj.sceneB}`} />
              <span className="brighten" />
              <FrameMarks no={proj.no} caption={proj.caption} coord={proj.location.toUpperCase()} />
              <span className="view-tag">View</span>
            </button>
            <div className="meta">
              <div className="meta-row">
                <span className="meta-no">{proj.no}</span>
                <span className="meta-yr">{proj.year}</span>
              </div>
              <h3 className="meta-name">{proj.name}</h3>
              <p className="meta-desc">{proj.desc}</p>
              <dl className="spec">
                <div><dt>Location</dt><dd>{proj.location}</dd></div>
                <div><dt>Client</dt><dd>{proj.client}</dd></div>
              </dl>
            </div>
          </Reveal>
        ))}
      </section>

      {/* PROCESS */}
      <section id="process" className="process">
        <Reveal className="sec-head">
          <span className="eyebrow">02 — Method</span>
          <h2 className="sec-title">Process</h2>
        </Reveal>
        <div className="steps">
          {PROCESS.map(([n, t, d], i) => (
            <Reveal className="step" key={n} style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="step-no">{n}</span>
              <div className="step-body">
                <h3 className="step-title">{t}</h3>
                <p className="step-desc">{d}</p>
              </div>
              {i < PROCESS.length - 1 && <span className="step-arrow" aria-hidden="true">↓</span>}
            </Reveal>
          ))}
        </div>
      </section>

      {/* STUDIO */}
      <section id="studio" className="studio">
        <Reveal className="sec-head">
          <span className="eyebrow">03 — Studio</span>
        </Reveal>
        <Reveal className="studio-stmt">
          <p>
            We translate architecture into <em>atmosphere</em> — through light,
            composition, and photoreal craft.
          </p>
        </Reveal>
        <Reveal className="studio-cols">
          <p>
            Space Scape makes the image of a building before the building exists.
            We work mostly in the hour before dusk, when interior light begins to
            do the talking, and we treat every frame the way a photographer treats
            a site visit that will never come twice.
          </p>
          <ul className="services">
            <li><span>Still Imagery</span><i>Photoreal stills, interior & exterior</i></li>
            <li><span>Cinematic Film</span><i>Animation & motion sequences</i></li>
            <li><span>Concept & Art Direction</span><i>Mood, framing, light strategy</i></li>
          </ul>
        </Reveal>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <Reveal className="contact-inner">
          <span className="eyebrow">04 — Contact</span>
          <h2 className="contact-title">
            Let's make the<br /><em>first image.</em>
          </h2>
          <div className="contact-grid">
            <a className="c-item" href="mailto:studio@spacescape.com">
              <span className="c-lab">Email</span>
              <span className="c-val">studio@spacescape.com</span>
            </a>
            <a className="c-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="c-lab">Instagram</span>
              <span className="c-val">@spacescape.viz</span>
            </a>
            <div className="c-item">
              <span className="c-lab">Location</span>
              <span className="c-val">Pune · India</span>
            </div>
          </div>
          <a className="cta solid" href="mailto:studio@spacescape.com">
            <span>Start an Inquiry</span>
            <span className="cta-rule" />
          </a>
        </Reveal>
        <footer className="foot">
          <span>SPACE SCAPE VISUALISATIONS</span>
          <span className="foot-mid">ARCHITECTURAL IMAGERY · EST 2019</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </section>

      {/* LIGHTBOX */}
      {p && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={p.name} onClick={() => setOpen(null)}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <button ref={closeBtnRef} className="lb-close" onClick={() => setOpen(null)} aria-label="Close">
              CLOSE <span>✕</span>
            </button>
            <div className="lb-stage">
              <div className={`scene ${p.scene}`} />
              <FrameMarks no={p.no} caption={p.caption} coord={p.location.toUpperCase()} />
            </div>
            <div className="lb-meta">
              <span className="lb-no">{p.no}</span>
              <h3 className="lb-name">{p.name}</h3>
              <p className="lb-desc">{p.desc}</p>
              <dl className="spec">
                <div><dt>Location</dt><dd>{p.location}</dd></div>
                <div><dt>Client</dt><dd>{p.client}</dd></div>
                <div><dt>Year</dt><dd>{p.year}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

.ss{
  --bg:#090909; --surf:#111111; --text:#E8E6E3; --muted:#8D8D8D;
  --bronze:#B6895B; --draft:#4C4C4C; --line:rgba(232,230,227,0.10);
  --pad:clamp(20px,5vw,72px); --maxw:1480px;
  --serif:'Cormorant Garamond',Georgia,serif;
  --mono:'IBM Plex Mono',ui-monospace,monospace;
  background:var(--bg); color:var(--text);
  font-family:var(--serif); -webkit-font-smoothing:antialiased;
  overflow-x:hidden; position:relative;
}
.ss *{box-sizing:border-box; margin:0; padding:0;}
.ss a{color:inherit; text-decoration:none; cursor:pointer;}
.ss button{font:inherit; color:inherit; background:none; border:none; cursor:pointer;}
.ss ::selection{background:var(--bronze); color:#090909;}
.ss em{font-style:italic; color:var(--bronze);}

/* grain over everything */
.ss::after{
  content:""; position:fixed; inset:0; z-index:60; pointer-events:none; opacity:.5;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
}

/* ---------- NAV ---------- */
.nav{
  position:fixed; top:0; left:0; right:0; z-index:50;
  display:flex; align-items:flex-start; justify-content:space-between;
  padding:30px clamp(20px,5vw,72px);
  transition:background .6s ease, padding .6s ease, opacity .4s ease;
  text-shadow:0 1px 26px rgba(0,0,0,.45);
}
.nav.solid{ background:linear-gradient(180deg,rgba(9,9,9,.9),rgba(9,9,9,0)); padding-top:22px; padding-bottom:22px; text-shadow:none;}
.brand{display:flex; flex-direction:column; line-height:1;}
.brand-name{font-size:18px; letter-spacing:.14em; font-weight:500;}
.brand-sub{font-family:var(--mono); font-size:8.5px; letter-spacing:.42em; color:var(--bronze); margin-top:5px;}
.links{display:flex; gap:clamp(18px,2.4vw,40px); align-items:center; padding-top:3px;}
.links a{font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--text); opacity:.78; transition:opacity .3s, color .3s;}
.links a:hover{opacity:1; color:var(--bronze);}
@media(max-width:680px){ .brand-sub{display:none;} .links{gap:14px;} .links a{font-size:9.5px;} }

/* ---------- SCENES (placeholder renders) ---------- */
.scene{position:absolute; inset:0; background:#0b0a09; overflow:hidden;}
.scene::before{ content:""; position:absolute; inset:-10%;
  background:
    radial-gradient(120% 70% at 50% 120%, rgba(255,255,255,.04), transparent 60%),
    repeating-linear-gradient(180deg, transparent 0 38px, rgba(255,255,255,.012) 38px 39px);
  mix-blend-mode:screen;}
.s0{ background:
   radial-gradient(80% 60% at 70% 30%, rgba(182,137,91,.34), transparent 55%),
   radial-gradient(60% 90% at 78% 64%, rgba(182,137,91,.14), transparent 60%),
   radial-gradient(120% 80% at 20% 90%, rgba(40,46,52,.6), transparent 60%),
   linear-gradient(170deg,#100e0c 0%,#0a0908 55%,#060606 100%);}
.s1{ background:radial-gradient(70% 60% at 64% 40%, rgba(182,137,91,.30), transparent 56%), radial-gradient(90% 70% at 18% 30%, rgba(54,72,58,.5), transparent 60%), linear-gradient(165deg,#0d100d,#080a08 60%,#050605);}
.s1b{ background:radial-gradient(80% 70% at 50% 55%, rgba(182,137,91,.42), transparent 60%), linear-gradient(165deg,#11100c,#070706);}
.s2{ background:radial-gradient(50% 50% at 30% 62%, rgba(182,137,91,.34), transparent 55%), radial-gradient(120% 80% at 90% 10%, rgba(70,80,96,.4), transparent 55%), linear-gradient(180deg,#0c0c0e,#070708);}
.s2b{ background:radial-gradient(60% 60% at 60% 50%, rgba(182,137,91,.40), transparent 58%), linear-gradient(180deg,#100f0d,#070706);}
.s3{ background:radial-gradient(90% 70% at 50% 80%, rgba(182,137,91,.40), transparent 60%), radial-gradient(120% 90% at 50% 8%, rgba(74,84,92,.5), transparent 55%), linear-gradient(180deg,#0b0d0f,#080808 70%,#060606);}
.s3b{ background:radial-gradient(100% 80% at 50% 70%, rgba(208,150,96,.46), transparent 62%), linear-gradient(180deg,#0d0e0e,#070605);}
.s4{ background:radial-gradient(40% 120% at 50% -10%, rgba(232,226,219,.30), transparent 55%), radial-gradient(60% 60% at 50% 90%, rgba(182,137,91,.18), transparent 60%), linear-gradient(180deg,#101010,#080808);}
.s4b{ background:radial-gradient(46% 130% at 56% -10%, rgba(232,226,219,.40), transparent 58%), linear-gradient(180deg,#121212,#080808);}
.s5{ background:radial-gradient(70% 50% at 50% 72%, rgba(106,124,136,.32), transparent 58%), radial-gradient(60% 60% at 30% 40%, rgba(182,137,91,.30), transparent 58%), linear-gradient(180deg,#0b0d0e,#080807 70%,#060606);}
.s5b{ background:radial-gradient(80% 60% at 50% 66%, rgba(138,154,162,.36), transparent 60%), linear-gradient(180deg,#0c0e0f,#070707);}
.s6{ background:radial-gradient(46% 70% at 26% 46%, rgba(182,137,91,.40), transparent 56%), radial-gradient(70% 60% at 84% 70%, rgba(120,86,54,.3), transparent 60%), linear-gradient(170deg,#0e0b08,#080706);}
.s6b{ background:radial-gradient(60% 80% at 40% 50%, rgba(204,150,96,.46), transparent 60%), linear-gradient(170deg,#100c08,#070605);}

/* ---------- FRAME MARKS ---------- */
.marks{position:absolute; inset:0; pointer-events:none; z-index:5;}
.reg{position:absolute; width:16px; height:16px; opacity:.5;}
.reg::before,.reg::after{content:""; position:absolute; background:var(--text);}
.reg::before{width:16px; height:1px; top:0; left:0;}
.reg::after{width:1px; height:16px; top:0; left:0;}
.reg.tl{top:18px; left:18px;}
.reg.tr{top:18px; right:18px; transform:scaleX(-1);}
.reg.bl{bottom:18px; left:18px; transform:scaleY(-1);}
.reg.br{bottom:18px; right:18px; transform:scale(-1);}
.m-no,.m-coord,.m-cap{position:absolute; font-family:var(--mono); font-size:9.5px; letter-spacing:.2em; color:var(--text); opacity:.62;}
.m-no{top:18px; left:42px; color:var(--bronze); opacity:.85;}
.m-coord{top:18px; right:42px; text-align:right; max-width:50%;}
.m-cap{bottom:16px; left:42px;}
.scalebar{position:absolute; bottom:20px; right:42px; display:flex; gap:0; opacity:.5;}
.scalebar i{width:14px; height:6px; border:1px solid var(--text); border-right:none;}
.scalebar i:last-child{border-right:1px solid var(--text);}
.scalebar i:nth-child(odd){background:rgba(232,230,227,.5);}
@media(max-width:680px){ .m-coord{display:none;} .scalebar{display:none;} }

/* ---------- HERO ---------- */
.hero{position:relative; height:100vh; min-height:620px; display:flex; align-items:flex-end; overflow:hidden;}
.hero-scene-wrap{position:absolute; inset:0; z-index:0;}
.hero-scene{will-change:transform; transform:scale(1.06);}
.hero-veil{position:absolute; inset:0; background:linear-gradient(180deg, rgba(9,9,9,.55) 0%, rgba(9,9,9,.1) 38%, rgba(9,9,9,.72) 100%);}
.hero-inner{position:relative; z-index:6; padding:0 clamp(20px,5vw,72px) clamp(60px,9vh,110px); width:100%;}
.hero-title{font-weight:300; line-height:.86; letter-spacing:-.01em;}
.hero-title .ln{display:block; font-size:clamp(64px,15vw,210px);}
.hero-title .l2{margin-left:.06em; color:var(--text);}
.hero-mono{display:block; font-family:var(--mono); font-size:clamp(10px,1.1vw,13px); letter-spacing:.62em; color:var(--bronze); margin:18px 0 0 .14em;}
.hero-lede{max-width:30ch; margin-top:30px; font-size:clamp(17px,1.5vw,21px); line-height:1.5; color:var(--text); opacity:.82; font-weight:300;}
.scrollcue{position:absolute; bottom:34px; right:clamp(20px,5vw,72px); z-index:6; display:flex; flex-direction:column; align-items:center; gap:10px;}
.scrollcue span{font-family:var(--mono); font-size:9px; letter-spacing:.3em; color:var(--muted); writing-mode:vertical-rl;}
.scrollcue i{width:1px; height:54px; background:linear-gradient(var(--bronze),transparent); animation:cue 2.4s ease-in-out infinite;}
@keyframes cue{0%,100%{transform:scaleY(.4); transform-origin:top; opacity:.4;}50%{transform:scaleY(1); opacity:1;}}

/* hero load animation */
.hero-title .ln{opacity:0; transform:translateY(28px); animation:rise 1.4s cubic-bezier(.16,1,.3,1) forwards;}
.hero-title .l1{animation-delay:.25s;} .hero-title .l2{animation-delay:.42s;}
.hero-mono{opacity:0; animation:fade 1.2s ease forwards .7s;}
.hero-lede{opacity:0; animation:fade 1.2s ease forwards .92s;}
.hero .cta{opacity:0; animation:fade 1.2s ease forwards 1.12s;}
@keyframes rise{to{opacity:1; transform:translateY(0);}}
@keyframes fade{from{opacity:0;}to{opacity:.82;}}

/* ---------- CTA ---------- */
.cta{display:inline-flex; flex-direction:column; gap:9px; margin-top:38px; font-family:var(--mono); font-size:11px; letter-spacing:.24em; text-transform:uppercase;}
.cta .cta-rule{height:1px; width:100%; background:var(--text); transform:scaleX(1); transform-origin:left; transition:transform .5s cubic-bezier(.16,1,.3,1), background .4s;}
.cta:hover .cta-rule{background:var(--bronze); transform:scaleX(.7);}
.cta.solid{margin-top:46px; color:var(--bronze);}

/* ---------- shared section heads ---------- */
.eyebrow{font-family:var(--mono); font-size:10.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--bronze); display:block;}
.sec-head{padding:clamp(90px,14vh,170px) var(--pad) 0; max-width:var(--maxw); margin:0 auto; width:100%;}
.sec-title{font-weight:300; font-size:clamp(40px,7vw,92px); line-height:1; margin-top:14px; letter-spacing:-.01em;}

/* ---------- reveal ---------- */
.reveal{opacity:0; transform:translateY(34px); transition:opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1);}
.reveal.in{opacity:1; transform:none;}

/* ---------- PROJECTS ---------- */
.projects{padding-bottom:40px;}
.project{display:grid; gap:clamp(24px,4vw,60px); align-items:center; max-width:var(--maxw); margin:clamp(70px,11vh,150px) auto 0; padding:0 var(--pad); grid-template-columns:1.35fr .65fr;}
.project.alt{grid-template-columns:.65fr 1.35fr;}
.project.alt .meta{order:-1;}
.project.wide{grid-template-columns:1fr; gap:30px;}
.project.wide .meta{order:0;}
.project.wide .frame{aspect-ratio:21/9;}
.frame{position:relative; width:100%; aspect-ratio:4/3; overflow:hidden; display:block; background:#070706; outline:none;}
.frame .scene{transition:transform 1.6s cubic-bezier(.16,1,.3,1), filter .6s ease;}
.frame .scene.shift{opacity:0; transition:opacity .9s ease;}
.frame .brighten{position:absolute; inset:0; background:rgba(232,226,219,0); transition:background .6s ease; z-index:4;}
.frame .marks{opacity:.55; transition:opacity .6s ease;}
.frame .view-tag{position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) scale(.9); z-index:6; font-family:var(--mono); font-size:10px; letter-spacing:.3em; text-transform:uppercase; color:#0c0b0a; background:var(--bronze); padding:11px 18px; border-radius:50%; width:78px; height:78px; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .45s ease, transform .6s cubic-bezier(.16,1,.3,1);}
@media(hover:hover){
  .frame:hover .scene{transform:scale(1.05);}
  .frame:hover .scene.shift{opacity:1;}
  .frame:hover .brighten{background:rgba(232,226,219,.06);}
  .frame:hover .marks{opacity:1;}
  .frame:hover .m-no{opacity:1; letter-spacing:.26em;}
  .frame:hover .view-tag{opacity:1; transform:translate(-50%,-50%) scale(1);}
}
.frame:focus-visible{box-shadow:inset 0 0 0 2px var(--bronze);}
.meta-row{display:flex; justify-content:space-between; align-items:baseline; border-top:1px solid var(--line); padding-top:14px;}
.meta-no{font-family:var(--mono); font-size:12px; letter-spacing:.2em; color:var(--bronze);}
.meta-yr{font-family:var(--mono); font-size:11px; letter-spacing:.2em; color:var(--muted);}
.meta-name{font-weight:300; font-size:clamp(30px,4vw,52px); line-height:1.02; margin:18px 0 16px;}
.meta-desc{font-size:clamp(15px,1.3vw,18px); line-height:1.6; color:var(--text); opacity:.74; font-weight:300; max-width:42ch;}
.spec{display:flex; gap:36px; margin-top:26px; flex-wrap:wrap;}
.spec dt{font-family:var(--mono); font-size:9px; letter-spacing:.24em; text-transform:uppercase; color:var(--muted); margin-bottom:6px;}
.spec dd{font-family:var(--mono); font-size:12px; letter-spacing:.04em; color:var(--text);}
@media(max-width:860px){
  .project,.project.alt{grid-template-columns:1fr;}
  .project.alt .meta{order:0;}
  .frame,.project.wide .frame{aspect-ratio:3/2;}
}

/* ---------- PROCESS ---------- */
.process{max-width:var(--maxw); margin:0 auto;}
.steps{padding:clamp(50px,8vh,90px) var(--pad) 0; max-width:1120px;}
.step{position:relative; display:grid; grid-template-columns:120px 1fr; gap:clamp(20px,4vw,60px); padding:clamp(28px,5vh,46px) 0; border-top:1px solid var(--line); align-items:start;}
.step:last-child{border-bottom:1px solid var(--line);}
.step-no{font-family:var(--mono); font-size:13px; letter-spacing:.2em; color:var(--bronze); padding-top:8px;}
.step-title{font-weight:300; font-size:clamp(28px,4vw,46px); line-height:1; margin-bottom:14px;}
.step-desc{font-size:clamp(15px,1.3vw,18px); line-height:1.6; color:var(--text); opacity:.72; font-weight:300; max-width:52ch;}
.step-arrow{position:absolute; left:0; bottom:-11px; font-family:var(--mono); color:var(--draft); font-size:14px;}
@media(max-width:680px){ .step{grid-template-columns:54px 1fr; gap:16px;} }

/* ---------- STUDIO ---------- */
.studio{max-width:var(--maxw); margin:0 auto; padding:0 var(--pad);}
.studio .sec-head{padding-left:0; padding-right:0;}
.studio-stmt{padding-top:8px; max-width:18ch;}
.studio-stmt p{font-weight:300; font-size:clamp(34px,6vw,78px); line-height:1.06; letter-spacing:-.01em;}
.studio-cols{display:grid; grid-template-columns:1.1fr .9fr; gap:clamp(30px,6vw,90px); margin-top:clamp(40px,7vh,80px); align-items:start;}
.studio-cols > p{font-size:clamp(16px,1.4vw,19px); line-height:1.7; color:var(--text); opacity:.78; font-weight:300; max-width:54ch;}
.services{list-style:none;}
.services li{display:flex; flex-direction:column; gap:5px; padding:18px 0; border-top:1px solid var(--line);}
.services li:last-child{border-bottom:1px solid var(--line);}
.services span{font-size:20px; font-weight:400;}
.services i{font-family:var(--mono); font-style:normal; font-size:11px; letter-spacing:.1em; color:var(--muted);}
@media(max-width:860px){ .studio-cols{grid-template-columns:1fr;} }

/* ---------- CONTACT ---------- */
.contact{max-width:var(--maxw); margin:0 auto; padding:clamp(110px,18vh,220px) var(--pad) 0;}
.contact .eyebrow{margin-bottom:26px;}
.contact-title{font-weight:300; font-size:clamp(46px,9vw,128px); line-height:.96; letter-spacing:-.02em;}
.contact-grid{display:flex; flex-wrap:wrap; gap:clamp(28px,6vw,90px); margin-top:clamp(46px,8vh,80px);}
.c-item{display:flex; flex-direction:column; gap:9px;}
.c-lab{font-family:var(--mono); font-size:9px; letter-spacing:.26em; text-transform:uppercase; color:var(--muted);}
.c-val{font-size:clamp(18px,2vw,26px); transition:color .3s;}
a.c-item:hover .c-val{color:var(--bronze);}
.foot{display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-top:clamp(90px,16vh,180px); padding:26px 0; border-top:1px solid var(--line); font-family:var(--mono); font-size:9.5px; letter-spacing:.2em; color:var(--muted); text-transform:uppercase;}
.foot-mid{color:var(--draft);}

/* ---------- LIGHTBOX ---------- */
.lightbox{position:fixed; inset:0; z-index:100; background:rgba(5,5,5,.94); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:clamp(16px,4vw,56px); animation:lbfade .4s ease;}
@keyframes lbfade{from{opacity:0;}to{opacity:1;}}
.lb-inner{width:100%; max-width:1340px; display:grid; grid-template-columns:1.7fr .8fr; gap:clamp(20px,3vw,46px); align-items:center;}
.lb-stage{position:relative; aspect-ratio:16/10; overflow:hidden; background:#070706; animation:lbrise .6s cubic-bezier(.16,1,.3,1);}
@keyframes lbrise{from{opacity:0; transform:translateY(20px);}to{opacity:1; transform:none;}}
.lb-close{position:fixed; top:24px; right:clamp(20px,5vw,56px); z-index:101; font-family:var(--mono); font-size:10px; letter-spacing:.24em; color:var(--text); display:flex; gap:10px; align-items:center; opacity:.8; transition:color .3s,opacity .3s;}
.lb-close:hover{color:var(--bronze); opacity:1;}
.lb-no{font-family:var(--mono); font-size:12px; letter-spacing:.2em; color:var(--bronze);}
.lb-name{font-weight:300; font-size:clamp(30px,4vw,54px); line-height:1.02; margin:14px 0 18px;}
.lb-desc{font-size:clamp(15px,1.3vw,18px); line-height:1.6; color:var(--text); opacity:.76; font-weight:300; margin-bottom:24px;}
.lb-meta .spec{flex-direction:column; gap:18px;}
@media(max-width:860px){ .lb-inner{grid-template-columns:1fr; gap:22px; max-height:88vh; overflow:auto;} .lb-stage{aspect-ratio:16/11;} }

/* ---------- reduced motion ---------- */
@media(prefers-reduced-motion:reduce){
  .ss *{animation:none !important; transition:none !important;}
  .reveal{opacity:1; transform:none;}
  .hero-scene{transform:scale(1.04) !important;}
}
`;
