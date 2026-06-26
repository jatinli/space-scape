# Space Scape Visualisations

A single-page archviz studio site built as a self-contained React component.

## Live demo (no build step)

The site runs straight from source via a CDN-loaded React + Babel — no `npm install` needed.
Any static web server works; for example:

```bash
python -m http.server 5500
```

Then open <http://localhost:5500/index.html>.

> `index.html` fetches [`SpaceScape.jsx`](SpaceScape.jsx) at runtime, transforms the JSX in the
> browser, and mounts the `App` component. This is great for a quick demo but not optimized for
> production — for a real deployment, add a build tool (e.g. Vite).

## Files

| File | Purpose |
|------|---------|
| `SpaceScape.jsx` | The entire site — one React component with inline CSS |
| `index.html` | Zero-build loader (React + Babel via CDN) |

## Imagery

Every "render" is an atmospheric CSS placeholder (the `.scene` divs). To use real images,
replace each `<div className="scene ..">` with an `<img src="your-render.jpg" .. />` — the layout,
framing marks, and metadata are already built to hold photoreal stills.
