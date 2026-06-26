export type Project = {
  no: string;
  name: string;
  location: string;
  year: string;
  category: string;
  /** the architect / design studio who authored the design — always credited */
  architect: string;
  typology: string;
  status: string;
  size: string;
  desc: string;
  desc2: string;
  featured: boolean;
  /** placeholder render gradient keys (s1..s6) until real imagery is dropped in */
  scene: string;
  sceneB: string;
  align: "left" | "right" | "full";
  /** grid tile size for the works grid */
  span: "tall" | "wide" | "std";
};

export const PROJECTS: Project[] = [
  {
    no: "01",
    name: "Monolith Tower",
    location: "Dubai, AE",
    year: "2026",
    category: "Supertall · Mixed-Use",
    architect: "Atelier Kfield",
    typology: "Mixed-Use",
    status: "In Progress",
    size: "164,000 m²",
    desc: "A single fold of concrete and glass rising from the desert floor — a vertical city carved as one continuous gesture of light.",
    desc2: "Atelier Kfield designed Monolith to read as one uninterrupted surface from the highway, dissolving into terraces as you approach. Space Scape produced the exterior and aerial imagery — a full light study from dawn haze to blue hour — to present the design before ground was broken.",
    featured: true,
    scene: "s1",
    sceneB: "s4",
    align: "left",
    span: "tall",
  },
  {
    no: "02",
    name: "Glass Pavilion",
    location: "Reykjavík, IS",
    year: "2025",
    category: "Cultural · Exhibition",
    architect: "Brønd Studio",
    typology: "Cultural",
    status: "Completed",
    size: "9,400 m²",
    desc: "Walls dissolve into the landscape. The building exists only as a frame for the moving northern light passing through it.",
    desc2: "Brønd Studio asked for a building that disappears. We answered with imagery that follows the light rather than the structure — long exposures of aurora across the glass, interiors lit only by what the sky gives. Shot across a single Arctic night.",
    featured: false,
    scene: "s4",
    sceneB: "s2",
    align: "right",
    span: "std",
  },
  {
    no: "03",
    name: "The Cantilever",
    location: "Big Sur, US",
    year: "2025",
    category: "Residential · Private",
    architect: "Hale Office",
    typology: "Residential",
    status: "Completed",
    size: "1,200 m²",
    desc: "A house held in mid-air over the Pacific — a horizontal line drawn against the horizon, anchored only by shadow.",
    desc2: "Everything about the image had to feel weightless. We placed the camera below the deck to let Hale Office's cantilever read against open sky, and graded the whole sequence to the ten minutes before the sun lets go of the water.",
    featured: true,
    scene: "s3",
    sceneB: "s5",
    align: "full",
    span: "wide",
  },
  {
    no: "04",
    name: "Concrete Cathedral",
    location: "Lisbon, PT",
    year: "2024",
    category: "Civic · Sacred",
    architect: "Praxis Arquitectos",
    typology: "Civic",
    status: "Completed",
    size: "21,000 m²",
    desc: "Light falls five storeys before it touches the floor. Mass becomes weightless in the silence of the volume.",
    desc2: "The drama is entirely in Praxis Arquitectos' section. We modelled the path of a single shaft of light through the day and built the interior imagery around the one minute it reaches the altar — mass dissolving into atmosphere.",
    featured: false,
    scene: "s2",
    sceneB: "s6",
    align: "left",
    span: "std",
  },
  {
    no: "05",
    name: "Vertical Garden",
    location: "Singapore, SG",
    year: "2026",
    category: "Mixed-Use · Tower",
    architect: "Ng + Lin",
    typology: "Mixed-Use",
    status: "In Progress",
    size: "88,000 m²",
    desc: "A tower that wears its landscape on the outside — thirty floors of terraced green spilling toward the street.",
    desc2: "The challenge was making Ng + Lin's planting feel inevitable rather than decorative. We grew the vegetation digitally across thirty levels and lit it in tropical afternoon haze, so the green reads as the building's primary material.",
    featured: true,
    scene: "s5",
    sceneB: "s1",
    align: "right",
    span: "tall",
  },
  {
    no: "06",
    name: "Desert Observatory",
    location: "AlUla, SA",
    year: "2027",
    category: "Cultural · Research",
    architect: "Studio Hejaz",
    typology: "Cultural",
    status: "Concept",
    size: "14,500 m²",
    desc: "Sandstone and shade engineered for forty degrees, opening to the sky at the exact hour the heat finally breaks.",
    desc2: "A concept piece for Studio Hejaz, carried entirely by imagery. We rendered the observatory at three moments — blistering noon, the break of dusk, and a clear desert night — to argue the architecture through light and shadow alone.",
    featured: false,
    scene: "s6",
    sceneB: "s3",
    align: "full",
    span: "std",
  },
];
