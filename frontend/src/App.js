import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { CATEGORIES } from "@/data/menuData";
import useScreenWakeLock from "@/hooks/useScreenWakeLock";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import MenuSection from "@/components/MenuSection";
import PhotoBreak from "@/components/PhotoBreak";
import { CitrusSlice } from "@/components/Decor";

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

function App() {
  const lenisRef = useRef(null);
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  // Evita que el teléfono/tablet apague la pantalla mientras el menú está abierto.
  useScreenWakeLock();

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
    lenisRef.current = lenis;
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
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
  }, []);

  const scrollTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -76, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Hero onEnter={() => scrollTo(CATEGORIES[0].id)} />

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

      <CategoryNav categories={CATEGORIES} activeId={activeId} onSelect={scrollTo} />

      <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-12 md:px-8">
        <CitrusSlice className="text-azul pointer-events-none absolute -right-10 top-40 h-40 w-40 opacity-[0.07]" />
        <CitrusSlice className="text-azul pointer-events-none absolute -left-12 top-[55%] h-48 w-48 opacity-[0.06]" />

        {GROUPS.map((group) => {
          const cats = CATEGORIES.filter((c) => c.group === group.id);
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
          Buffet Mar y Tierra
        </p>
      </footer>
    </div>
  );
}

export default App;
