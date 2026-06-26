import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from "react";

/*
  SPACE SCAPE VISUALISATIONS — modelled on big.dk.

  HOME: a vertical scroll of projects. Each row = a small abstract glyph +
  name + location on the left, a large render on the right. Category tabs in
  the header filter the list; a search field filters by name.

  PROJECT: click a row and it opens full-screen. You slide HORIZONTALLY
  (wheel / drag / arrow keys / on-screen arrows) through panels:
    1 · hero image + metadata (name, location, year, client, typology, size, status)
    2 · the description, with a second still
    3 · the site-plan / map outline

  IMAGERY: every "render" is a CSS placeholder (the .scene divs); the site
  plan is the .map placeholder. Swap in <img>/real plans when ready.
*/

const PROJECTS = [
  { no: "001", name: "Forest Residence", city: "Aspen", country: "United States", year: 2025, client: "Hølm Architecture", typology: "Residential", type: "Exterior", size: 540, status: "In Progress", glyph: "g1", scene: "s1", sceneB: "s4",
    lede: "A glass house held between pines, chased through the last warm light until the interior begins to glow on its own." },
  { no: "002", name: "Urban Loft", city: "Berlin", country: "Germany", year: 2025, client: "Atelier Voss", typology: "Residential", type: "Interior", size: 180, status: "Completed", glyph: "g2", scene: "s2", sceneB: "s5",
    lede: "Concrete, steel and a single low lamp — the city stays outside; the room keeps everything that matters close." },
  { no: "003", name: "Coastal Retreat", city: "Amalfi", country: "Italy", year: 2024, client: "Marin + Co", typology: "Hospitality", type: "Exterior", size: 320, status: "Completed", glyph: "g3", scene: "s3", sceneB: "s6", film: true,
    lede: "A terrace that gives way to nothing but sea, built to be photographed in the ten minutes before the sun lets go." },
  { no: "004", name: "Museum Atrium", city: "Lisbon", country: "Portugal", year: 2024, client: "Praxis Studio", typology: "Cultural", type: "Interior", size: 2100, status: "Completed", glyph: "g4", scene: "s4", sceneB: "s1",
    lede: "Light falls five storeys before it reaches the floor; we let the silence of the volume do the work." },
  { no: "005", name: "Private Villa", city: "Mumbai", country: "India", year: 2025, client: "Verma Associates", typology: "Residential", type: "Exterior", size: 760, status: "In Progress", glyph: "g5", scene: "s5", sceneB: "s2",
    lede: "Water, warm stone, and a pool that holds the sky after dark — a house seen the way its owners will remember it." },
  { no: "006", name: "Boutique Hotel", city: "Kyoto", country: "Japan", year: 2023, client: "Nakamura Design", typology: "Hospitality", type: "Interior", size: 1400, status: "Completed", glyph: "g6", scene: "s6", sceneB: "s3", film: true,
    lede: "A lobby measured in shadow: timber, paper light, and the quiet of a room that asks you to lower your voice." },
  { no: "007", name: "Alpine Chapel", city: "Zermatt", country: "Switzerland", year: 2026, client: "Brunner Werk", typology: "Cultural", type: "Exterior", size: 240, status: "Concept", glyph: "g3", scene: "s3", sceneB: "s4",
    lede: "A single fold of concrete against snow, lit so the altar reads from the valley below." },
  { no: "008", name: "Harbour Terminal", city: "Rotterdam", country: "Netherlands", year: 2024, client: "Delta Urban", typology: "Infrastructure", type: "Exterior", size: 9800, status: "In Progress", glyph: "g4", scene: "s4", sceneB: "s2",
    lede: "A civic threshold where the city meets the water, drawn at the scale of arrival." },
  { no: "009", name: "Reading Room", city: "Copenhagen", country: "Denmark", year: 2023, client: "Nord Bibliotek", typology: "Civic", type: "Interior", size: 460, status: "Completed", glyph: "g1", scene: "s1", sceneB: "s4",
    lede: "Oak, daylight and long tables — a room built around the act of paying attention." },
  { no: "010", name: "Desert Pavilion", city: "AlUla", country: "Saudi Arabia", year: 2026, client: "Hejaz Cultural", typology: "Cultural", type: "Exterior", size: 880, status: "Concept", glyph: "g5", scene: "s5", sceneB: "s3",
    lede: "Sandstone and shade engineered for forty degrees, photographed at the hour the heat finally breaks." },
  { no: "011", name: "Vertical Garden", city: "Singapore", country: "Singapore", year: 2025, client: "Ng & Partners", typology: "Mixed-Use", type: "Exterior", size: 3200, status: "In Progress", glyph: "g2", scene: "s2", sceneB: "s5", film: true,
    lede: "A tower that wears its landscape on the outside, green spilling down thirty floors." },
  { no: "012", name: "Gallery House", city: "Oslo", country: "Norway", year: 2022, client: "Lysverk", typology: "Residential", type: "Interior", size: 410, status: "Completed", glyph: "g6", scene: "s6", sceneB: "s1",
    lede: "White walls, north light, and a procession of rooms made to hold work that isn't there yet." },
];

const CATS = ["All", "Exterior", "Interior", "Concept", "Film"];

function tagsOf(p) {
  const t = [p.type];
  if (p.status === "Concept") t.push("Concept");
  if (p.film) t.push("Film");
  return t;
}
const ft = (m2) => Math.round(m2 * 10.7639).toLocaleString();

/* ---- abstract per-project glyph (black tile, white mark) ---- */
function Glyph({ kind }) {
  return <span className={`glyph ${kind}`} aria-hidden="true" />;
}

/* ---- CSS site-plan placeholder ---- */
function SitePlan({ label }) {
  return (
    <div className="map" role="img" aria-label={`Site plan, ${label}`}>
      <span className="road rh" /><span className="road rv" />
      <span className="blk b1" /><span className="blk b2" /><span className="blk b3" />
      <span className="blk b4" /><span className="blk b5" /><span className="blk b6" />
      <span className="grn gA" /><span className="grn gB" />
      <span className="site" />
      <span className="map-tag">SITE PLAN · {label}</span>
    </div>
  );
}

export default function App() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  const [open, setOpen] = useState(null);   // project or null
  const [menu, setMenu] = useState(false);

  const stripRef = useRef(null);
  const searchRef = useRef(null);

  const rows = useMemo(() => {
    let l = PROJECTS;
    if (cat !== "All") l = l.filter((p) => tagsOf(p).includes(cat));
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter((p) => (p.name + p.city + p.country).toLowerCase().includes(q));
    }
    return l;
  }, [cat, query]);

  /* project viewer: scroll lock, reset to first panel, key + wheel nav */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const strip = stripRef.current;
    if (strip) strip.scrollLeft = 0;

    const onKey = (e) => {
      if (e.key === "Escape") return setOpen(null);
      if (!strip) return;
      if (e.key === "ArrowRight") strip.scrollBy({ left: strip.clientWidth, behavior: "smooth" });
      if (e.key === "ArrowLeft") strip.scrollBy({ left: -strip.clientWidth, behavior: "smooth" });
    };
    const onWheel = (e) => {
      if (!strip || window.innerWidth <= 880) return;       // mobile scrolls vertically
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        strip.scrollLeft += e.deltaY;
      }
    };
    window.addEventListener("keydown", onKey);
    strip?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      strip?.removeEventListener("wheel", onWheel);
    };
  }, [open]);

  useEffect(() => { if (search) searchRef.current?.focus(); }, [search]);

  const slide = (dir) => {
    const s = stripRef.current;
    if (s) s.scrollBy({ left: dir * s.clientWidth, behavior: "smooth" });
  };
  const go = useCallback((id) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="ss">
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="hd">
        <button className="wm" onClick={() => go("top")} aria-label="Space Scape, to top">
          SPACE<span>SCAPE</span>
        </button>

        <nav className={`tabs ${menu ? "on" : ""}`}>
          {CATS.map((c) => (
            <button key={c} className={`tab ${cat === c ? "on" : ""}`} onClick={() => { setCat(c); setMenu(false); }}>
              {c === "All" ? "All Work" : c}
            </button>
          ))}
        </nav>

        <div className="hd-right">
          <div className={`srch ${search ? "on" : ""}`}>
            <button className="srch-ico" onClick={() => setSearch((s) => !s)} aria-label="Search">⌕</button>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH"
              aria-label="Search projects"
            />
          </div>
          <span className="hd-cat">{(cat === "All" ? `${rows.length} Projects` : cat).toUpperCase()}</span>
          <button className="burger" onClick={() => setMenu((m) => !m)} aria-label="Menu"><i /><i /></button>
        </div>
      </header>

      {/* HOME — VERTICAL PROJECT LIST */}
      <main id="top" className="list">
        {rows.map((p) => (
          <button key={p.no} className="item" onClick={() => setOpen(p)} aria-label={`Open ${p.name}`}>
            <div className="item-id">
              <Glyph kind={p.glyph} />
              <span className="item-txt">
                <span className="item-name">{p.name}</span>
                <span className="item-loc">{p.city}, {p.country}</span>
              </span>
            </div>
            <div className="item-img">
              <div className={`scene ${p.scene}`} />
              <span className="item-view">VIEW PROJECT →</span>
            </div>
          </button>
        ))}
        {rows.length === 0 && <p className="empty">No projects match “{query || cat}”.</p>}
      </main>

      {/* STUDIO + CONTACT */}
      <section id="studio" className="studio">
        <span className="kick">Studio</span>
        <h2 className="stmt">We make the image of a building <em>before the building exists.</em></h2>
        <div className="studio-cols">
          <p>
            Space Scape works mostly in the hour before dusk, when interior light begins
            to do the talking. We treat every frame the way a photographer treats a site
            visit that will never come twice — light first, accuracy second, atmosphere always.
          </p>
          <ul className="svc">
            <li><span>Still Imagery</span><i>Photoreal stills, interior &amp; exterior</i></li>
            <li><span>Cinematic Film</span><i>Animation &amp; motion sequences</i></li>
            <li><span>Concept &amp; Art Direction</span><i>Mood, framing, light strategy</i></li>
          </ul>
        </div>
      </section>

      <section id="contact" className="contact">
        <span className="kick">Contact</span>
        <h2 className="contact-h">Let's make the first image.</h2>
        <div className="contact-grid">
          <a className="ci" href="mailto:studio@spacescape.com"><span>Email</span><b>studio@spacescape.com</b></a>
          <a className="ci" href="#" onClick={(e) => e.preventDefault()}><span>Instagram</span><b>@spacescape.viz</b></a>
          <div className="ci"><span>Location</span><b>Pune · India</b></div>
        </div>
      </section>

      <footer className="ft">
        <span>SPACE SCAPE VISUALISATIONS</span>
        <span className="ft-mid">ARCHITECTURAL IMAGERY · EST 2019</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>

      {/* PROJECT VIEWER — HORIZONTAL */}
      {open && (
        <div className="pv" role="dialog" aria-modal="true" aria-label={open.name}>
          <button className="pv-x" onClick={() => setOpen(null)} aria-label="Close">CLOSE ✕</button>
          <div className="pv-arrows" aria-hidden="true">
            <button onClick={() => slide(-1)} aria-label="Previous">‹</button>
            <button onClick={() => slide(1)} aria-label="Next">›</button>
          </div>

          <div className="strip" ref={stripRef}>
            {/* PANEL 1 — hero + metadata */}
            <section className="panel p-hero">
              <aside className="pmeta">
                <Glyph kind={open.glyph} />
                <h2 className="pm-name">{open.name}</h2>
                <p className="pm-loc">{open.city}, {open.country}</p>
                <div className="pm-year">{open.year}</div>
                <dl className="pm-dl">
                  <dt>Client</dt><dd>{open.client}</dd>
                  <dt>Typology</dt><dd>{open.typology}</dd>
                  <dt>Size m²/ft²</dt><dd>{open.size.toLocaleString()} / {ft(open.size)}</dd>
                  <dt>Status</dt><dd>{open.status}</dd>
                </dl>
                <div className="share"><span>Share</span><i>✉</i><i>f</i><i>in</i><i>𝕏</i></div>
              </aside>
              <figure className="phero"><div className={`scene ${open.scene}`} /></figure>
              <div className="pintro">
                <p>{open.lede}</p>
                <span className="pnext">Scroll / slide right →</span>
              </div>
            </section>

            {/* PANEL 2 — description */}
            <section className="panel p-desc">
              <figure className="pd-img"><div className={`scene ${open.sceneB}`} /></figure>
              <div className="pd-text">
                <span className="kick">Description</span>
                <p>{open.lede}</p>
                <p>
                  {open.name} is a {open.typology.toLowerCase()} project in {open.city}, {open.country}.
                  Space Scape produced the {open.type.toLowerCase()} imagery — light study, materials and
                  final grade — presenting the design at {open.size.toLocaleString()} m² before construction
                  began, in close dialogue with {open.client}.
                </p>
                <span className="pnext">Slide right for site plan →</span>
              </div>
            </section>

            {/* PANEL 3 — site plan / map */}
            <section className="panel p-map">
              <SitePlan label={`${open.city}, ${open.country}`} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

.ss{
  --bg:#ffffff; --ink:#111111; --mut:#8a8a8a; --soft:#f4f3f1;
  --line:rgba(17,17,17,.16); --line2:rgba(17,17,17,.08);
  --sans:'Archivo','Helvetica Neue',Arial,sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,monospace;
  background:var(--bg); color:var(--ink);
  font-family:var(--sans); -webkit-font-smoothing:antialiased; letter-spacing:-0.01em;
}
.ss *{box-sizing:border-box; margin:0; padding:0;}
.ss a{color:inherit; text-decoration:none; cursor:pointer;}
.ss button{font:inherit; color:inherit; background:none; border:none; cursor:pointer; text-align:left;}
.ss ::selection{background:var(--ink); color:#fff;}
.ss em{font-style:normal; color:var(--mut);}

/* ---------- HEADER ---------- */
.hd{position:sticky; top:0; z-index:40; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:20px;
  padding:16px clamp(16px,3vw,40px); background:#fff; border-bottom:1px solid var(--line2);}
.wm{font-weight:700; font-size:19px; letter-spacing:.02em; line-height:1;}
.wm span{margin-left:.18em;}
.tabs{display:flex; justify-content:center; gap:clamp(16px,3vw,54px);}
.tab{font-family:var(--mono); font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--mut); padding:4px 0; border-bottom:1px solid transparent; transition:color .2s, border-color .2s; white-space:nowrap;}
.tab:hover{color:var(--ink);}
.tab.on{color:var(--ink); border-color:var(--ink);}
.hd-right{display:flex; align-items:center; gap:16px; justify-self:end;}
.srch{display:flex; align-items:center;}
.srch-ico{font-size:18px; line-height:1; color:var(--mut); padding:2px 4px;}
.srch-ico:hover{color:var(--ink);}
.srch input{width:0; opacity:0; border:none; border-bottom:1px solid var(--line); background:none; font-family:var(--mono); font-size:11px; letter-spacing:.1em; padding:3px 0; margin-left:0; transition:width .3s ease, opacity .3s ease, margin-left .3s ease; outline:none;}
.srch.on input{width:128px; opacity:1; margin-left:8px;}
.hd-cat{font-family:var(--mono); font-size:11px; letter-spacing:.14em; color:var(--mut); white-space:nowrap;}
.burger{display:none; flex-direction:column; gap:5px; padding:4px;}
.burger i{width:22px; height:1.5px; background:var(--ink);}
@media(max-width:880px){
  .hd{grid-template-columns:auto auto; }
  .burger{display:flex;}
  .hd-cat{display:none;}
  .tabs{position:absolute; top:100%; left:0; right:0; flex-direction:column; gap:0; background:#fff; border-bottom:1px solid var(--line); max-height:0; overflow:hidden; transition:max-height .3s ease; justify-content:flex-start;}
  .tabs.on{max-height:320px;}
  .tab{padding:15px clamp(16px,4vw,40px); border-top:1px solid var(--line2);}
}

/* ---------- HOME LIST ---------- */
.list{max-width:1500px; margin:0 auto; padding:clamp(30px,6vw,80px) clamp(16px,4vw,56px);}
.item{display:grid; grid-template-columns:minmax(220px,1fr) 1.45fr; align-items:center; gap:clamp(20px,4vw,70px);
  width:100%; padding:clamp(26px,5vw,64px) 0; border-top:1px solid var(--line2);}
.item:first-child{border-top:none;}
.item-id{display:flex; align-items:center; gap:20px;}
.item-txt{display:flex; flex-direction:column; gap:7px;}
.item-name{font-size:clamp(20px,2.4vw,34px); font-weight:600; letter-spacing:-0.02em; line-height:1.04;}
.item-loc{font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--mut);}
.item-img{position:relative; aspect-ratio:16/10; overflow:hidden; background:#0b0a09;}
.item-img .scene{position:absolute; inset:0; transition:transform 1s cubic-bezier(.16,1,.3,1);}
.item-view{position:absolute; left:18px; bottom:16px; z-index:3; font-family:var(--mono); font-size:10px; letter-spacing:.16em; color:#fff; background:rgba(17,17,17,.6); padding:7px 11px; opacity:0; transform:translateY(6px); transition:opacity .35s ease, transform .35s ease;}
@media(hover:hover){
  .item:hover .item-img .scene{transform:scale(1.05);}
  .item:hover .item-name{text-decoration:underline; text-underline-offset:5px; text-decoration-thickness:1px;}
  .item:hover .item-view{opacity:1; transform:none;}
}
.empty{padding:80px 0; font-family:var(--mono); font-size:13px; color:var(--mut);}
@media(max-width:760px){
  .item{grid-template-columns:1fr; gap:18px;}
  .item-img{aspect-ratio:3/2;}
}

/* ---------- GLYPH ---------- */
.glyph{position:relative; width:46px; height:46px; flex:none; background:var(--ink); overflow:hidden;}
.glyph::after{content:""; position:absolute; background:#fff;}
.g1::after{left:18%; right:18%; top:44%; height:12%; border-radius:50%;}                 /* horizon bar */
.g2::after{left:50%; top:20%; width:0; height:0; transform:translateX(-50%); background:none; border-left:11px solid transparent; border-right:11px solid transparent; border-bottom:22px solid #fff;} /* triangle */
.g3::after{left:20%; top:20%; width:60%; height:60%; border-radius:50%; background:none; border:5px solid #fff;}  /* ring */
.g4::after{left:24%; top:24%; width:52%; height:52%; background:#fff; transform:rotate(45deg);}  /* diamond */
.g5::after{left:0; top:46%; width:100%; height:8%; transform:rotate(-32deg); transform-origin:center;}  /* slash */
.g6::after{left:50%; top:0; width:50%; height:100%; background:#fff;}  /* half */

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

/* ---------- STUDIO / CONTACT / FOOTER ---------- */
.studio{padding:clamp(70px,12vw,150px) clamp(16px,4vw,56px) 0; border-top:1px solid var(--ink);}
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
.contact{padding:clamp(80px,14vw,180px) clamp(16px,4vw,56px) 0;}
.contact-h{font-weight:600; font-size:clamp(36px,8vw,104px); line-height:.98; letter-spacing:-0.04em; margin-top:16px;}
.contact-grid{display:flex; flex-wrap:wrap; gap:clamp(24px,6vw,80px); margin-top:clamp(40px,7vw,72px);}
.ci{display:flex; flex-direction:column; gap:7px;}
.ci span{font-family:var(--mono); font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:var(--mut);}
.ci b{font-weight:500; font-size:clamp(17px,2vw,24px); letter-spacing:-0.01em;}
a.ci:hover b{text-decoration:underline; text-underline-offset:4px;}
.ft{display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-top:clamp(80px,14vw,170px);
  padding:22px clamp(16px,4vw,56px); border-top:1px solid var(--ink);
  font-family:var(--mono); font-size:9.5px; letter-spacing:.16em; color:var(--mut); text-transform:uppercase;}

/* ---------- PROJECT VIEWER ---------- */
.pv{position:fixed; inset:0; z-index:100; background:#fff; animation:pvf .3s ease;}
@keyframes pvf{from{opacity:0;}to{opacity:1;}}
.pv-x{position:fixed; top:18px; right:clamp(16px,4vw,40px); z-index:103; font-family:var(--mono); font-size:10px; letter-spacing:.18em; padding:8px 12px; border:1px solid var(--ink); background:#fff;}
.pv-x:hover{background:var(--ink); color:#fff;}
.pv-arrows{position:fixed; bottom:22px; right:clamp(16px,4vw,40px); z-index:103; display:flex; gap:8px;}
.pv-arrows button{width:44px; height:44px; border:1px solid var(--ink); font-size:20px; display:flex; align-items:center; justify-content:center; background:#fff;}
.pv-arrows button:hover{background:var(--ink); color:#fff;}

.strip{height:100%; display:flex; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory; scroll-behavior:smooth; scrollbar-width:none;}
.strip::-webkit-scrollbar{display:none;}
.panel{min-width:100%; height:100%; scroll-snap-align:start; flex:none; padding:clamp(70px,9vh,96px) clamp(20px,4vw,64px) clamp(80px,10vh,100px);}

/* panel 1 */
.p-hero{display:grid; grid-template-columns:260px 1fr 300px; gap:clamp(20px,3vw,48px); align-items:center;}
.pmeta{display:flex; flex-direction:column; align-self:center;}
.pmeta .glyph{margin-bottom:22px;}
.pm-name{font-weight:600; font-size:clamp(24px,2.4vw,34px); line-height:1.05; letter-spacing:-0.02em;}
.pm-loc{font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--mut); margin-top:8px;}
.pm-year{font-family:var(--mono); font-size:13px; color:var(--mut); margin:26px 0 18px;}
.pm-dl{display:grid; grid-template-columns:1fr; gap:14px;}
.pm-dl dt{font-family:var(--mono); font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:var(--mut); margin-bottom:3px;}
.pm-dl dd{font-size:15px; font-weight:500; letter-spacing:-0.01em;}
.share{display:flex; align-items:center; gap:8px; margin-top:28px;}
.share span{font-family:var(--mono); font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:var(--mut); margin-right:4px;}
.share i{font-style:normal; width:22px; height:22px; background:var(--ink); color:#fff; font-size:10px; display:flex; align-items:center; justify-content:center;}
.phero{position:relative; height:100%; min-height:300px; overflow:hidden;}
.phero .scene{position:absolute; inset:0;}
.pintro{align-self:center; display:flex; flex-direction:column; gap:22px;}
.pintro p{font-size:clamp(15px,1.2vw,18px); line-height:1.55; color:#2c2a27;}
.pnext{font-family:var(--mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--mut);}

/* panel 2 */
.p-desc{display:grid; grid-template-columns:1.1fr .9fr; gap:clamp(24px,4vw,64px); align-items:center;}
.pd-img{position:relative; height:100%; min-height:300px; overflow:hidden;}
.pd-img .scene{position:absolute; inset:0;}
.pd-text{display:flex; flex-direction:column; gap:20px; max-width:52ch;}
.pd-text .kick{margin-bottom:2px;}
.pd-text p{font-size:clamp(15px,1.3vw,19px); line-height:1.65; color:#2c2a27;}

/* panel 3 */
.p-map{display:flex; align-items:stretch; justify-content:center;}
.p-map .map{width:100%; height:100%;}

/* site plan placeholder */
.map{position:relative; background:#f1f0ec; overflow:hidden; border:1px solid var(--line2);}
.map::before{content:""; position:absolute; inset:0;
  background:repeating-linear-gradient(90deg, transparent 0 52px, rgba(17,17,17,.045) 52px 53px),
    repeating-linear-gradient(0deg, transparent 0 52px, rgba(17,17,17,.045) 52px 53px);}
.map .road{position:absolute; background:#fff; box-shadow:0 0 0 1px rgba(17,17,17,.08);}
.map .rh{left:0; right:0; top:62%; height:46px;}
.map .rv{top:0; bottom:0; left:24%; width:40px; transform:skewX(-12deg);}
.map .blk{position:absolute; background:#fff; border:1px solid rgba(17,17,17,.18);}
.map .b1{left:30%; top:14%; width:16%; height:13%;}
.map .b2{left:52%; top:10%; width:22%; height:16%; transform:rotate(3deg);}
.map .b3{left:78%; top:20%; width:14%; height:22%;}
.map .b4{left:34%; top:34%; width:12%; height:18%;}
.map .b5{left:60%; top:40%; width:18%; height:14%; transform:rotate(-4deg);}
.map .b6{left:10%; top:70%; width:20%; height:16%;}
.map .grn{position:absolute; background:rgba(120,150,96,.32); border:1px solid rgba(90,120,70,.35);}
.map .gA{left:50%; top:30%; width:30%; height:30%; transform:rotate(2deg);}
.map .gB{left:80%; top:64%; width:14%; height:20%;}
.map .site{position:absolute; left:30%; top:12%; width:46%; height:54%; border:1.5px dashed #c0392b; transform:rotate(-4deg);}
.map-tag{position:absolute; left:18px; bottom:16px; font-family:var(--mono); font-size:10px; letter-spacing:.14em; color:#6a6a6a; background:rgba(255,255,255,.7); padding:5px 9px;}

@media(max-width:880px){
  .strip{flex-direction:column; overflow-x:hidden; overflow-y:auto; scroll-snap-type:y proximity;}
  .panel{min-width:100%; height:auto; min-height:auto; padding:clamp(64px,12vh,88px) clamp(18px,5vw,40px) 48px;}
  .p-hero,.p-desc{grid-template-columns:1fr; gap:24px;}
  .phero,.pd-img,.p-map .map{min-height:62vw; height:62vw;}
  .pv-arrows{display:none;}
}

/* ---------- reduced motion ---------- */
@media(prefers-reduced-motion:reduce){ .ss *{animation:none !important; transition:none !important;} .strip{scroll-behavior:auto;} }
`;
