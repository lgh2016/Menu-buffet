import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { api } from "@/lib/api";
import useScreenWakeLock from "@/hooks/useScreenWakeLock";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import MenuSection from "@/components/MenuSection";
import PhotoBreak from "@/components/PhotoBreak";
import { CitrusSlice } from "@/components/Decor";
import SeptemberMenu from "@/components/september/SeptemberMenu";

const GROUPS = [
  { id: "cocina", label: "DE LA COCINA" },
  { id: "bebidas", label: "PARA TOMAR" },
  { id: "dulce", label: "PARA EL ANTOJO" },
];

const PHOTO_BREAKS = {
  cocina: [
    { src: "/images/foto-camarones.jpg", alt: "Camarones" },
    { src: "/images/foto-pescado.jpg", alt: "Mojarra frita" },
  ],
  bebidas: [
    { src: "/images/foto-michelada.jpg", alt: "Michelada" },
    { src: "/images/foto-cerveza.jpg", alt: "Cerveza" },
  ],
  dulce: [
    { src: "/images/foto-cafe.jpg", alt: "Café" },
    { src: "/images/foto-postre.jpg", alt: "Crepas flambeadas" },
  ],
};

const MARQUEE_ITEMS = [
  "MARISCOS FRESCOS",
  "CORTES A LA BRASA",
  "MICHELADAS",
  "BUFFET MAR Y TIERRA",
  "MOJARRAS",
  "CAMARONES",
  "POSTRES",
];

const darken = (hex) => {
  const n = (hex || "").replace("#", "");
  if (n.length !== 6) return hex;
  const f = (v) => Math.max(0, Math.round(parseInt(v, 16) * 0.72)).toString(16).padStart(2, "0");
  return `#${f(n.slice(0, 2))}${f(n.slice(2, 4))}${f(n.slice(4, 6))}`;
};

const MenuPage = () => {
  const lenisRef = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [activeId, setActiveId] = useState(null);
  // Evita que el teléfono/tablet apague la pantalla mientras el menú está abierto.
  useScreenWakeLock();

  useEffect(() => {
    api.get("/menu/public").then((res) => setData(res.data)).catch(() => setError(true));
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
    lenisRef.current = lenis;
    return () => lenis.destroy();
  }, []);

  // El menú público combina: categorías del buffet activo + catálogo global de bebidas.
  // En "Para el antojo" el café (catálogo global) va primero para conservar el orden original.
  const categories = useMemo(() => {
    if (!data) return [];
    const buffetCats = data.buffet.categories || [];
    const drinkCats = data.drinks || [];
    const byGroup = (g) =>
      g === "dulce"
        ? [...drinkCats.filter((c) => c.group === g), ...buffetCats.filter((c) => c.group === g)]
        : [...buffetCats.filter((c) => c.group === g), ...drinkCats.filter((c) => c.group === g)];
    return GROUPS.flatMap((g) => byGroup(g.id));
  }, [data]);

  // Tema visual del buffet activo: las bebidas globales heredan el mismo estilo.
  useEffect(() => {
    const theme = data?.buffet?.theme;
    if (!theme) return;
    const root = document.documentElement.style;
    root.setProperty("--azul", theme.primaryColor);
    root.setProperty("--azul-oscuro", darken(theme.primaryColor));
    root.setProperty("--naranja", theme.secondaryColor);
    root.setProperty("--papel", theme.backgroundColor);
  }, [data]);

  useEffect(() => {
    if (!categories.length) return;
    setActiveId(categories[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.dataset.navSection);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    document.querySelectorAll("[data-nav-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  const scrollTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -76, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <img src="/images/logo-oficial.jpeg" alt="Los Andariegos" className="h-20 w-20 rounded-full object-cover" />
        <p className="font-menu text-sm uppercase tracking-widest text-gray-500">
          No pudimos cargar el menú. Intenta de nuevo en un momento.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img
          src="/images/logo-oficial.jpeg"
          alt="Cargando Los Andariegos"
          className="h-24 w-24 animate-pulse rounded-full object-cover"
        />
      </div>
    );
  }

  const theme = data.buffet.theme || {};

  // Plantilla visual asociada al buffet activo: solo los buffets configurados con
  // template "mexican-independence" usan la experiencia especial de septiembre.
  if ((theme.template || "classic") === "mexican-independence") {
    return (
      <SeptemberMenu
        buffet={data.buffet}
        categories={categories}
        activeId={activeId}
        onSelect={scrollTo}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Hero
        onEnter={() => categories.length && scrollTo(categories[0].id)}
        title={theme.title}
        subtitle={theme.subtitle}
        backgroundImage={theme.backgroundImage}
        decorativeImage={theme.decorativeImage}
      />

      {theme.banner && (
        <img src={theme.banner} alt={data.buffet.name} className="max-h-40 w-full object-cover" />
      )}

      <div className="bg-azul overflow-hidden py-2.5" aria-hidden="true">
        <div className="marquee-track flex w-max items-center gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="font-menu flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
              {item}
              <span className="text-white/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      <CategoryNav categories={categories} activeId={activeId} onSelect={scrollTo} />

      <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-12 md:px-8">
        <CitrusSlice className="text-azul pointer-events-none absolute -right-10 top-40 h-40 w-40 opacity-[0.07]" />
        <CitrusSlice className="text-azul pointer-events-none absolute -left-12 top-[55%] h-48 w-48 opacity-[0.06]" />

        {GROUPS.map((group) => {
          const cats = categories.filter((c) => c.group === group.id);
          if (!cats.length) return null;
          return (
            <div key={group.id} className="mb-6">
              <div className="mb-8 flex items-center gap-4">
                <span className="font-menu text-naranja text-xs font-bold uppercase tracking-[0.4em]">
                  {group.label}
                </span>
                <span className="h-px flex-1 bg-blue-900/15" />
              </div>
              <div className="gap-6 [column-fill:_balance] md:columns-2 [&>section]:mb-6">
                {cats.map((cat) => (
                  <MenuSection key={cat.id} category={cat} />
                ))}
              </div>
              <PhotoBreak photos={PHOTO_BREAKS[group.id]} caption={group.label} />
            </div>
          );
        })}
      </main>

      <footer className="border-t border-blue-900/10 py-10 text-center">
        <img
          src="/images/logo-oficial.jpeg"
          alt="Los Andariegos"
          className="mx-auto h-16 w-16 rounded-full object-cover opacity-90"
        />
        <p className="font-display text-azul-oscuro mt-4 text-sm tracking-wider">LOS ANDARIEGOS</p>
        <p className="font-menu text-naranja mt-1 text-xs font-semibold uppercase tracking-[0.3em]">
          {data.buffet.name}
        </p>
      </footer>
    </div>
  );
};

export default MenuPage;
