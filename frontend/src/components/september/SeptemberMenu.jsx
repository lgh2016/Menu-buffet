import { motion } from "framer-motion";
import SeptHero from "./SeptHero";
import { Flame } from "../Decor";

const TIEMPO_LABELS = ["PRIMER TIEMPO", "SEGUNDO TIEMPO", "TERCER TIEMPO"];
const ACCENTS = ["#0f7a44", "#c9a227", "#a52633"];

const GoldDivider = () => (
  <div className="my-4 flex items-center gap-2" aria-hidden="true">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />
    <span className="h-1.5 w-1.5 rotate-45 bg-[#c9a227]" />
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />
  </div>
);

const TricolorBar = ({ className = "" }) => (
  <div className={`flex h-1 overflow-hidden rounded-full ${className}`} aria-hidden="true">
    <span className="flex-1 bg-[#0f7a44]" />
    <span className="flex-1 bg-[#f3ead3]" />
    <span className="flex-1 bg-[#a52633]" />
  </div>
);

const SeptNav = ({ categories, activeId, onSelect }) => (
  <nav
    data-testid="nav-categorias"
    className="sticky top-0 z-40 border-b border-[#c9a227]/15 bg-[#0d0b09]/95 backdrop-blur-md"
  >
    <div className="no-scrollbar mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-3">
      {categories.map((cat) => {
        const active = cat.id === activeId;
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSelect(cat.id)}
            data-testid={`nav-cat-${cat.id}`}
            className={`font-menu shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
              active
                ? "border-[#c9a227] bg-[#c9a227] text-[#14100b]"
                : "border-[#c9a227]/30 text-[#d8c69a] hover:border-[#c9a227]/70"
            }`}
          >
            {cat.short || cat.name}
          </motion.button>
        );
      })}
    </div>
  </nav>
);

const SeptSection = ({ category, eyebrow, accent }) => (
  <motion.section
    id={category.id}
    data-nav-section={category.id}
    data-testid={`section-${category.id}`}
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="sept-card scroll-mt-24 break-inside-avoid rounded-2xl p-6 md:p-8"
  >
    <span className="mb-4 block h-0.5 w-14 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
    {eyebrow && (
      <p className="font-menu text-[11px] font-bold uppercase tracking-[0.45em] text-[#c9a227]">{eyebrow}</p>
    )}
    <h2 className="font-display mt-1 text-xl leading-tight tracking-wide text-[#f5efe0] md:text-2xl">
      {category.name}
    </h2>
    <GoldDivider />
    <ul className="space-y-3">
      {category.products.map((p, i) => (
        <motion.li
          key={`${p.name}-${i}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
          className="flex items-baseline gap-3"
        >
          {p.image && (
            <img src={p.image} alt="" className="h-10 w-10 shrink-0 self-center rounded-lg object-cover ring-1 ring-[#c9a227]/30" />
          )}
          <span className="font-menu text-[15px] font-medium uppercase leading-snug tracking-wide text-[#eadfc3] md:text-base">
            {p.name}
          </span>
          {p.description && (
            <span className="font-menu text-xs normal-case tracking-normal text-[#a08c63]">{p.description}</span>
          )}
          {p.price && (
            <>
              <span className="mx-1 flex-1 border-b border-dotted border-[#c9a227]/25" aria-hidden="true" />
              <span className="font-menu shrink-0 text-[15px] font-bold text-[#d9b45b] md:text-base">{p.price}</span>
            </>
          )}
        </motion.li>
      ))}
    </ul>
    {category.sharedPrice && (
      <p className="font-menu mt-4 text-right text-base font-bold text-[#d9b45b]">{category.sharedPrice}</p>
    )}
  </motion.section>
);

const SeptPhotos = ({ photos, testId }) => (
  <div data-testid={testId} className="my-12 flex flex-wrap items-center justify-center gap-6 md:gap-10">
    {photos.map((photo, i) => (
      <motion.figure
        key={photo.src}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
        className={i % 2 === 1 ? "md:translate-y-5" : ""}
      >
        <div className="group overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] ring-1 ring-[#c9a227]/35">
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            className="h-44 w-44 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] md:h-56 md:w-56"
          />
        </div>
        <figcaption className="font-menu mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9a227]/80">
          {photo.alt}
        </figcaption>
      </motion.figure>
    ))}
  </div>
);

const SeptemberMenu = ({ buffet, categories, activeId, onSelect }) => {
  const theme = buffet.theme || {};
  const tiempos = categories.filter((c) => c.group === "cocina");
  const bebidas = categories.filter((c) => c.group === "bebidas");
  const dulce = categories.filter((c) => c.group === "dulce");
  const drinksAll = [...bebidas, ...dulce];

  return (
    <div className="sept-root min-h-screen">
      <div className="sept-grain" aria-hidden="true" />
      <SeptHero
        onEnter={() => tiempos.length && onSelect(tiempos[0].id)}
        title={theme.title}
        subtitle={theme.subtitle}
      />
      <SeptNav categories={categories} activeId={activeId} onSelect={onSelect} />

      <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-14 md:px-8">
        <div className="mb-10 text-center">
          <p className="font-menu text-[11px] font-bold uppercase tracking-[0.5em] text-[#c9a227]">
            Buffet Mar y Tierra
          </p>
          <h2 className="font-display mt-2 text-3xl text-[#f5efe0] md:text-4xl">El Festín</h2>
          <TricolorBar className="mx-auto mt-4 w-44" />
        </div>

        <div className="mx-auto max-w-3xl space-y-8">
          {tiempos.map((cat, i) => {
            let eyebrow = TIEMPO_LABELS[i] || null;
            if (eyebrow && eyebrow === cat.name) eyebrow = null;
            if (!eyebrow && i >= TIEMPO_LABELS.length) eyebrow = "PARA ACOMPAÑAR";
            return <SeptSection key={cat.id} category={cat} eyebrow={eyebrow} accent={ACCENTS[i % ACCENTS.length]} />;
          })}
        </div>

        <SeptPhotos
          testId="fotos-festin"
          photos={[
            { src: "/images/foto-camarones.jpg", alt: "Del mar" },
            { src: "/images/foto-pescado.jpg", alt: "A la brasa" },
          ]}
        />

        {drinksAll.length > 0 && (
          <>
            <div data-testid="transicion-bebidas" className="mb-10 mt-16 text-center">
              <Flame className="mx-auto h-6 w-6 text-[#c9a227]" />
              <p className="font-menu mt-3 text-[11px] font-bold uppercase tracking-[0.5em] text-[#c9a227]">
                Para acompañar la celebración
              </p>
              <h2 className="font-display mt-2 text-3xl text-[#f5efe0] md:text-4xl">
                Brinda al estilo Los Andariegos
              </h2>
              <TricolorBar className="mx-auto mt-4 w-44" />
            </div>
            <div className="gap-6 [column-fill:_balance] md:columns-2 [&>section]:mb-6">
              {drinksAll.map((cat, i) => (
                <SeptSection key={cat.id} category={cat} eyebrow={null} accent={ACCENTS[i % ACCENTS.length]} />
              ))}
            </div>
            <SeptPhotos
              testId="fotos-brindis"
              photos={[
                { src: "/images/foto-michelada.jpg", alt: "Michelada" },
                { src: "/images/foto-cerveza.jpg", alt: "Cerveza" },
              ]}
            />
          </>
        )}
      </main>

      <footer className="border-t border-[#c9a227]/15 py-10 text-center">
        <img
          src="/images/logo-oficial.jpeg"
          alt="Los Andariegos"
          className="mx-auto h-16 w-16 rounded-full object-cover ring-1 ring-[#c9a227]/50"
        />
        <p className="font-display mt-4 text-sm tracking-wider text-[#f5efe0]">LOS ANDARIEGOS</p>
        <p className="font-menu mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a227]">
          {buffet.name}
        </p>
      </footer>
    </div>
  );
};

export default SeptemberMenu;
