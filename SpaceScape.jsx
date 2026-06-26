import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from "react";

/*
  SPACE SCAPE VISUALISATIONS — archive interface, modelled on big.dk.

  The whole site is one systematic INDEX: a filterable, sortable table of
  projects. Hovering a row reveals the render as a cursor-following preview;
  rows invert on hover; clicking opens the project. Light, monochrome,
  neo-grotesque — a database you can read top to bottom.

  IMAGERY: every "render" is an atmospheric CSS placeholder (the .scene divs).
  Replace each <div className="scene ..">  with <img src="your-render.jpg" .. />.
*/

const PROJECTS = [
  { no: "001", name: "Forest Residence", city: "Aspen", country: "US", year: 2025, type: "Exterior", status: "In Progress", client: "Hølm Architecture", size: 540, scene: "s1" },
  { no: "002", name: "Urban Loft", city: "Berlin", country: "DE", year: 2025, type: "Interior", status: "Built", client: "Atelier Voss", size: 180, scene: "s2" },
  { no: "003", name: "Coastal Retreat", city: "Amalfi", country: "IT", year: 2024, type: "Exterior", status: "Built", client: "Marin + Co", size: 320, scene: "s3" },
  { no: "004", name: "Museum Atrium", city: "Lisbon", country: "PT", year: 2024, type: "Interior", status: "Built", client: "Praxis Studio", size: 2100, scene: "s4" },
  { no: "005", name: "Private Villa", city: "Mumbai", country: "IN", year: 2025, type: "Exterior", status: "In Progress", client: "Verma Associates", size: 760, scene: "s5" },
  { no: "006", name: "Boutique Hotel", city: "Kyoto", country: "JP", year: 2023, type: "Interior", status: "Built", client: "Nakamura Design", size: 1400, scene: "s6" },
  { no: "007", name: "Alpine Chapel", city: "Zermatt", country: "CH", year: 2026, type: "Exterior", status: "Concept", client: "Brunner Werk", size: 240, scene: "s3" },
  { no: "008", name: "Harbour Terminal", city: "Rotterdam", country: "NL", year: 2024, type: "Exterior", status: "In Progress", client: "Delta Urban", size: 9800, scene: "s4" },
  { no: "009", name: "Reading Room", city: "Copenhagen", country: "DK", year: 2023, type: "Interior", status: "Built", client: "Nord Bibliotek", size: 460, scene: "s1" },
  { no: "010", name: "Desert Pavilion", city: "AlUla", country: "SA", year: 2026, type: "Exterior", status: "Concept", client: "Hejaz Cultural", size: 880, scene: "s5" },
  { no: "011", name: "Vertical Garden", city: "Singapore", country: "SG", year: 2025, type: "Exterior", status: "In Progress", client: "Ng & Partners", size: 3200, scene: "s2" },
  { no: "012", name: "Gallery House", city: "Oslo", country: "NO", year: 2022, type: "Interior", status: "Built", client: "Lysverk", size: 410, scene: "s6" },
];

const SORTS = [
  { id: "no", label: "Index" },
  { id: "name", label: "Name" },
  { id: "year", label: "Year" },
  { id: "location", label: "Location" },
  { id: "size", label: "Size" },
];

const TYPES = ["All", "Exterior", "Interior"];
const STATUSES = ["All", "Built", "In Progress", "Concept"];

function sortProjects(list, sort) {
  const a = [...list];
  switch (sort) {
    case "name": return a.sort((x, y) => x.name.localeCompare(y.name));
    case "year": return a.sort((x, y) => y.year - x.year || x.no.localeCompare(y.no));
    case "location": return a.sort((x, y) => x.city.localeCompare(y.city));
    case "size": return a.sort((x, y) => y.size - x.size);
    default: return a.sort((x, y) => x.no.localeCompare(y.no));
  }
}

export default function App() {
  const [sort, setSort] = useState("no");
  const [typeF, setTypeF] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [hover, setHover] = useState(null);   // project or null
  const [open, setOpen] = useState(null);     // project or null
  const [menu, setMenu] = useState(false);

  const previewRef = useRef(null);
  const closeRef = useRef(null);

  const rows = useMemo(() => {
    let l = PROJECTS;
    if (typeF !== "All") l = l.filter((p) => p.type === typeF);
    if (statusF !== "All") l = l.filter((p) => p.status === statusF);
    return sortProjects(l, sort);
  }, [sort, typeF, statusF]);

  /* cursor-following preview — positioned imperatively to avoid re-renders */
  const onMove = useCallback((e) => {
    const el = previewRef.current;
    if (!el) return;
    const w = 380, pad = 18;
    let x = e.clientX + 28;
    let y = e.clientY - 40;
    if (x + w + pad > window.innerWidth) x = e.clientX - w - 28;
    if (y < pad) y = pad;
    if (y + w * 0.72 + pad > window.innerHeight) y = window.innerHeight - w * 0.72 - pad;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  /* detail: lock scroll, esc to close, focus close button */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const go = useCallback((id) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const showPreview = hover && open === null;

  return (
    <div className="ss">
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="hd">
        <button className="wm" onClick={() => go("top")} aria-label="Space Scape, to top">
          <span className="wm-mark">SPACE&nbsp;SCAPE</span>
          <span className="wm-sub">VISUALISATIONS</span>
        </button>
        <nav className={`hd-nav ${menu ? "on" : ""}`}>
          <a onClick={() => go("index")}>Index</a>
          <a onClick={() => go("studio")}>Studio</a>
          <a onClick={() => go("contact")}>Contact</a>
        </nav>
        <button className="burger" onClick={() => setMenu((m) => !m)} aria-label="Menu">
          <i /><i />
        </button>
      </header>

      <main id="top">
        {/* INTRO STRIP */}
        <section className="intro">
          <p className="intro-lede">
            Photorealistic architectural imagery and cinematic visualisation —
            an index of selected work for architecture, interiors and development.
          </p>
          <div className="intro-meta">
            <span>EST 2019</span>
            <span>PUNE · INDIA</span>
            <span>{PROJECTS.length} PROJECTS</span>
          </div>
        </section>

        {/* CONTROL BAR */}
        <div className="bar" id="index">
          <div className="bar-grp">
            <span className="bar-lab">Sort</span>
            {SORTS.map((s) => (
              <button
                key={s.id}
                className={`chip ${sort === s.id ? "on" : ""}`}
                onClick={() => setSort(s.id)}
              >{s.label}</button>
            ))}
          </div>
          <div className="bar-grp">
            <span className="bar-lab">Type</span>
            {TYPES.map((t) => (
              <button key={t} className={`chip ${typeF === t ? "on" : ""}`} onClick={() => setTypeF(t)}>{t}</button>
            ))}
          </div>
          <div className="bar-grp">
            <span className="bar-lab">Status</span>
            {STATUSES.map((t) => (
              <button key={t} className={`chip ${statusF === t ? "on" : ""}`} onClick={() => setStatusF(t)}>{t}</button>
            ))}
          </div>
          <span className="bar-count">{rows.length} / {PROJECTS.length}</span>
        </div>

        {/* INDEX TABLE */}
        <section className="idx" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <div className="idx-head" aria-hidden="true">
            <span>No.</span>
            <span>Project</span>
            <span>Location</span>
            <span>Type</span>
            <span>Year</span>
            <span>Status</span>
          </div>
          {rows.map((p) => (
            <button
              key={p.no}
              className="row"
              onMouseEnter={() => setHover(p)}
              onFocus={() => setHover(p)}
              onClick={() => setOpen(p)}
              aria-label={`Open ${p.name}`}
            >
              <span className="c-no">{p.no}</span>
              <span className="c-name">{p.name}</span>
              <span className="c-loc">{p.city}, {p.country}</span>
              <span className="c-type">{p.type}</span>
              <span className="c-year">{p.year}</span>
              <span className="c-status"><i className={`dot ${p.status === "Built" ? "d-built" : p.status === "Concept" ? "d-con" : "d-prog"}`} />{p.status}</span>
            </button>
          ))}
          {rows.length === 0 && <div className="empty">No projects match these filters.</div>}
        </section>

        {/* STUDIO */}
        <section id="studio" className="studio">
          <span className="kick">Studio</span>
          <h2 className="stmt">We make the image of a building <em>before the building exists.</em></h2>
          <div className="studio-cols">
            <p>
              Space Scape works mostly in the hour before dusk, when interior light
              begins to do the talking. We treat every frame the way a photographer
              treats a site visit that will never come twice — light first, accuracy
              second, atmosphere always.
            </p>
            <ul className="svc">
              <li><span>Still Imagery</span><i>Photoreal stills, interior &amp; exterior</i></li>
              <li><span>Cinematic Film</span><i>Animation &amp; motion sequences</i></li>
              <li><span>Concept &amp; Art Direction</span><i>Mood, framing, light strategy</i></li>
            </ul>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact">
          <span className="kick">Contact</span>
          <h2 className="contact-h">Let's make the first image.</h2>
          <div className="contact-grid">
            <a className="ci" href="mailto:studio@spacescape.com"><span>Email</span><b>studio@spacescape.com</b></a>
            <a className="ci" href="#" onClick={(e) => e.preventDefault()}><span>Instagram</span><b>@spacescape.viz</b></a>
            <div className="ci"><span>Location</span><b>Pune · India</b></div>
          </div>
        </section>
      </main>

      <footer className="ft">
        <span>SPACE SCAPE VISUALISATIONS</span>
        <span className="ft-mid">ARCHITECTURAL IMAGERY · EST 2019</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>

      {/* CURSOR PREVIEW */}
      <div ref={previewRef} className={`peek ${showPreview ? "on" : ""}`} aria-hidden="true">
        <div className={`scene ${hover ? hover.scene : ""}`} />
        <span className="peek-cap">{hover ? `${hover.no} · ${hover.name}` : ""}</span>
      </div>

      {/* DETAIL */}
      {open && (
        <div className="lb" role="dialog" aria-modal="true" aria-label={open.name} onClick={() => setOpen(null)}>
          <button ref={closeRef} className="lb-x" onClick={() => setOpen(null)} aria-label="Close">CLOSE ✕</button>
          <div className="lb-in" onClick={(e) => e.stopPropagation()}>
            <div className="lb-stage"><div className={`scene ${open.scene}`} /></div>
            <div className="lb-meta">
              <span className="lb-no">{open.no} — {open.type}</span>
              <h3 className="lb-name">{open.name}</h3>
              <dl className="dl">
                <div><dt>Location</dt><dd>{open.city}, {open.country}</dd></div>
                <div><dt>Client</dt><dd>{open.client}</dd></div>
                <div><dt>Year</dt><dd>{open.year}</dd></div>
                <div><dt>Area</dt><dd>{open.size.toLocaleString()} m²</dd></div>
                <div><dt>Status</dt><dd>{open.status}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

.ss{
  --bg:#f4f3f1; --paper:#ffffff; --ink:#0d0d0d; --mut:#7c7a76;
  --line:rgba(13,13,13,.16); --line2:rgba(13,13,13,.08);
  --sans:'Archivo','Helvetica Neue',Arial,sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,monospace;
  background:var(--bg); color:var(--ink);
  font-family:var(--sans); -webkit-font-smoothing:antialiased;
  font-feature-settings:"tnum" 1; letter-spacing:-0.01em;
}
.ss *{box-sizing:border-box; margin:0; padding:0;}
.ss a{color:inherit; text-decoration:none; cursor:pointer;}
.ss button{font:inherit; color:inherit; background:none; border:none; cursor:pointer; text-align:left;}
.ss ::selection{background:var(--ink); color:var(--paper);}
.ss em{font-style:normal; color:var(--mut);}

/* ---------- HEADER ---------- */
.hd{position:sticky; top:0; z-index:40; display:flex; align-items:center; justify-content:space-between;
  padding:14px clamp(16px,4vw,40px); background:var(--bg); border-bottom:1px solid var(--ink);}
.wm{display:flex; flex-direction:column; line-height:1;}
.wm-mark{font-weight:700; font-size:clamp(15px,1.5vw,19px); letter-spacing:-0.02em;}
.wm-sub{font-family:var(--mono); font-size:8.5px; letter-spacing:.34em; color:var(--mut); margin-top:4px;}
.hd-nav{display:flex; gap:clamp(16px,2.4vw,38px);}
.hd-nav a{font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; padding:4px 0; border-bottom:1px solid transparent; transition:border-color .25s;}
.hd-nav a:hover{border-color:var(--ink);}
.burger{display:none; flex-direction:column; gap:5px; padding:6px;}
.burger i{width:22px; height:1.5px; background:var(--ink); display:block;}
@media(max-width:720px){
  .burger{display:flex;}
  .hd-nav{position:absolute; top:100%; right:0; left:0; flex-direction:column; gap:0; background:var(--bg); border-bottom:1px solid var(--ink); max-height:0; overflow:hidden; transition:max-height .3s ease;}
  .hd-nav.on{max-height:240px;}
  .hd-nav a{padding:16px clamp(16px,4vw,40px); border-top:1px solid var(--line2); border-bottom:none;}
}

/* ---------- INTRO ---------- */
.intro{display:flex; justify-content:space-between; align-items:flex-end; gap:30px; flex-wrap:wrap;
  padding:clamp(34px,7vw,80px) clamp(16px,4vw,40px) clamp(26px,4vw,46px);}
.intro-lede{max-width:46ch; font-size:clamp(20px,2.6vw,34px); line-height:1.18; font-weight:500; letter-spacing:-0.02em;}
.intro-meta{display:flex; gap:26px; font-family:var(--mono); font-size:10px; letter-spacing:.16em; color:var(--mut); white-space:nowrap;}

/* ---------- CONTROL BAR ---------- */
.bar{position:sticky; top:51px; z-index:30; display:flex; align-items:center; gap:clamp(14px,2.5vw,34px); flex-wrap:wrap;
  padding:11px clamp(16px,4vw,40px); background:var(--bg); border-top:1px solid var(--ink); border-bottom:1px solid var(--ink);}
.bar-grp{display:flex; align-items:center; gap:7px; flex-wrap:wrap;}
.bar-lab{font-family:var(--mono); font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:var(--mut); margin-right:3px;}
.chip{font-family:var(--mono); font-size:11px; letter-spacing:.04em; padding:4px 10px; border:1px solid var(--line); border-radius:40px; color:var(--mut); transition:all .2s ease; white-space:nowrap;}
.chip:hover{color:var(--ink); border-color:var(--ink);}
.chip.on{background:var(--ink); color:var(--paper); border-color:var(--ink);}
.bar-count{margin-left:auto; font-family:var(--mono); font-size:11px; letter-spacing:.08em; color:var(--mut);}
@media(max-width:720px){ .bar{top:50px;} .bar-count{display:none;} }

/* ---------- INDEX TABLE ---------- */
.idx{position:relative;}
.idx-head, .row{display:grid; grid-template-columns:64px 2.2fr 1.4fr 1fr 70px 1.3fr; align-items:center; gap:16px;
  padding:0 clamp(16px,4vw,40px);}
.idx-head{height:34px; font-family:var(--mono); font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:var(--mut); border-bottom:1px solid var(--line);}
.row{width:100%; height:clamp(56px,7vh,74px); border-bottom:1px solid var(--line2); transition:background .18s ease, color .18s ease, padding .25s ease; position:relative;}
.row:hover{background:var(--ink); color:var(--paper); padding-left:calc(clamp(16px,4vw,40px) + 10px);}
.row:focus-visible{outline:none; background:var(--ink); color:var(--paper);}
.c-no{font-family:var(--mono); font-size:11px; letter-spacing:.06em; color:var(--mut);}
.row:hover .c-no{color:var(--paper);}
.c-name{font-size:clamp(17px,2vw,26px); font-weight:600; letter-spacing:-0.02em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.c-loc,.c-type,.c-year{font-family:var(--mono); font-size:12px; letter-spacing:.02em; color:var(--mut);}
.row:hover .c-loc,.row:hover .c-type,.row:hover .c-year{color:var(--paper);}
.c-year{justify-self:start;}
.c-status{font-family:var(--mono); font-size:11px; letter-spacing:.04em; display:flex; align-items:center; gap:8px; color:var(--mut);}
.row:hover .c-status{color:var(--paper);}
.dot{width:6px; height:6px; border-radius:50%; flex:none; background:var(--mut);}
.d-built{background:#3a7d44;} .d-prog{background:#c08a2d;} .d-con{background:#9a9a9a;}
.row:hover .dot{background:var(--paper);}
.empty{padding:60px clamp(16px,4vw,40px); font-family:var(--mono); font-size:12px; color:var(--mut);}
@media(max-width:860px){
  .idx-head, .row{grid-template-columns:48px 2fr 1.2fr 80px; gap:12px;}
  .c-type, .c-status{display:none;}
}
@media(max-width:540px){
  .idx-head, .row{grid-template-columns:42px 1fr 64px; }
  .c-loc{display:none;}
  .row{height:60px;}
}

/* ---------- CURSOR PREVIEW ---------- */
.peek{position:fixed; top:0; left:0; z-index:60; width:380px; pointer-events:none;
  opacity:0; transition:opacity .22s ease; will-change:transform;}
.peek.on{opacity:1;}
.peek .scene{position:relative; width:100%; aspect-ratio:4/3; box-shadow:0 24px 60px rgba(0,0,0,.4);}
.peek-cap{display:block; margin-top:8px; font-family:var(--mono); font-size:10px; letter-spacing:.1em; color:var(--ink); background:var(--paper); padding:4px 7px; width:fit-content;}
@media(hover:none){ .peek{display:none;} }
@media(max-width:860px){ .peek{display:none;} }

/* ---------- SCENES (placeholder renders) ---------- */
.scene{background:#0b0a09; overflow:hidden;}
.scene::before{content:""; position:absolute; inset:-10%;
  background:radial-gradient(120% 70% at 50% 120%, rgba(255,255,255,.05), transparent 60%),
    repeating-linear-gradient(180deg, transparent 0 38px, rgba(255,255,255,.02) 38px 39px);
  mix-blend-mode:screen;}
.s1{background:radial-gradient(70% 60% at 64% 40%, rgba(182,137,91,.5), transparent 56%), radial-gradient(90% 70% at 18% 30%, rgba(54,72,58,.6), transparent 60%), linear-gradient(165deg,#0d100d,#080a08 60%,#050605);}
.s2{background:radial-gradient(50% 50% at 30% 62%, rgba(182,137,91,.46), transparent 55%), radial-gradient(120% 80% at 90% 10%, rgba(70,80,96,.5), transparent 55%), linear-gradient(180deg,#0c0c0e,#070708);}
.s3{background:radial-gradient(90% 70% at 50% 80%, rgba(208,150,96,.5), transparent 60%), radial-gradient(120% 90% at 50% 8%, rgba(74,84,92,.55), transparent 55%), linear-gradient(180deg,#0b0d0f,#080808 70%,#060606);}
.s4{background:radial-gradient(40% 120% at 50% -10%, rgba(232,226,219,.5), transparent 55%), radial-gradient(60% 60% at 50% 90%, rgba(182,137,91,.22), transparent 60%), linear-gradient(180deg,#101010,#080808);}
.s5{background:radial-gradient(70% 50% at 50% 72%, rgba(106,124,136,.42), transparent 58%), radial-gradient(60% 60% at 30% 40%, rgba(182,137,91,.4), transparent 58%), linear-gradient(180deg,#0b0d0e,#080807 70%,#060606);}
.s6{background:radial-gradient(46% 70% at 26% 46%, rgba(204,150,96,.5), transparent 56%), radial-gradient(70% 60% at 84% 70%, rgba(120,86,54,.4), transparent 60%), linear-gradient(170deg,#0e0b08,#080706);}

/* ---------- STUDIO ---------- */
.studio{padding:clamp(70px,12vw,150px) clamp(16px,4vw,40px) 0; border-top:1px solid var(--ink); margin-top:clamp(50px,9vw,110px);}
.kick{font-family:var(--mono); font-size:10px; letter-spacing:.24em; text-transform:uppercase; color:var(--mut); display:block;}
.stmt{font-weight:600; font-size:clamp(30px,6vw,76px); line-height:1.02; letter-spacing:-0.03em; margin-top:18px; max-width:20ch;}
.studio-cols{display:grid; grid-template-columns:1.1fr .9fr; gap:clamp(28px,6vw,90px); margin-top:clamp(40px,7vw,80px); align-items:start;}
.studio-cols>p{font-size:clamp(15px,1.4vw,19px); line-height:1.6; color:#34322f; max-width:54ch;}
.svc{list-style:none;}
.svc li{display:flex; flex-direction:column; gap:4px; padding:16px 0; border-top:1px solid var(--line);}
.svc li:last-child{border-bottom:1px solid var(--line);}
.svc span{font-size:19px; font-weight:600; letter-spacing:-0.01em;}
.svc i{font-family:var(--mono); font-style:normal; font-size:11px; letter-spacing:.06em; color:var(--mut);}
@media(max-width:760px){ .studio-cols{grid-template-columns:1fr;} }

/* ---------- CONTACT ---------- */
.contact{padding:clamp(80px,14vw,180px) clamp(16px,4vw,40px) 0;}
.contact-h{font-weight:600; font-size:clamp(36px,8vw,104px); line-height:.98; letter-spacing:-0.04em; margin-top:16px;}
.contact-grid{display:flex; flex-wrap:wrap; gap:clamp(24px,6vw,80px); margin-top:clamp(40px,7vw,72px);}
.ci{display:flex; flex-direction:column; gap:7px;}
.ci span{font-family:var(--mono); font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:var(--mut);}
.ci b{font-weight:500; font-size:clamp(17px,2vw,24px); letter-spacing:-0.01em;}
a.ci:hover b{text-decoration:underline; text-underline-offset:4px;}

/* ---------- FOOTER ---------- */
.ft{display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-top:clamp(80px,14vw,170px);
  padding:22px clamp(16px,4vw,40px); border-top:1px solid var(--ink);
  font-family:var(--mono); font-size:9.5px; letter-spacing:.16em; color:var(--mut); text-transform:uppercase;}

/* ---------- DETAIL ---------- */
.lb{position:fixed; inset:0; z-index:100; background:rgba(244,243,241,.97); backdrop-filter:blur(2px);
  display:flex; align-items:center; justify-content:center; padding:clamp(16px,4vw,56px); animation:lbf .3s ease;}
@keyframes lbf{from{opacity:0;}to{opacity:1;}}
.lb-x{position:fixed; top:18px; right:clamp(16px,4vw,40px); z-index:101; font-family:var(--mono); font-size:10px; letter-spacing:.18em; padding:8px 12px; border:1px solid var(--ink);}
.lb-x:hover{background:var(--ink); color:var(--paper);}
.lb-in{width:100%; max-width:1300px; display:grid; grid-template-columns:1.7fr .8fr; gap:clamp(20px,3vw,46px); align-items:center;}
.lb-stage{position:relative; aspect-ratio:16/10; overflow:hidden; animation:lbr .5s cubic-bezier(.16,1,.3,1);}
.lb-stage .scene{position:absolute; inset:0;}
@keyframes lbr{from{opacity:0; transform:translateY(16px);}to{opacity:1; transform:none;}}
.lb-no{font-family:var(--mono); font-size:11px; letter-spacing:.14em; color:var(--mut); text-transform:uppercase;}
.lb-name{font-weight:600; font-size:clamp(28px,4vw,52px); line-height:1.02; letter-spacing:-0.03em; margin:12px 0 22px;}
.dl{display:flex; flex-direction:column;}
.dl>div{display:flex; justify-content:space-between; gap:20px; padding:11px 0; border-top:1px solid var(--line2);}
.dl>div:last-child{border-bottom:1px solid var(--line2);}
.dl dt{font-family:var(--mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--mut);}
.dl dd{font-family:var(--mono); font-size:13px; letter-spacing:.02em;}
@media(max-width:860px){ .lb-in{grid-template-columns:1fr; gap:20px; max-height:86vh; overflow:auto;} }

/* ---------- reduced motion ---------- */
@media(prefers-reduced-motion:reduce){ .ss *{animation:none !important; transition:none !important;} }
`;
