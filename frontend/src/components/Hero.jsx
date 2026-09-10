import { motion } from "framer-motion";
import { CitrusSlice, Flame, ShrimpMark } from "./Decor";

const lineReveal = {
  hidden: { y: "110%" },
  visible: (i) => ({
    y: 0,
    transition: { delay: 0.55 + i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Hero = ({ onEnter }) => {
  return (
    <header
      data-testid="portada"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6"
    >
      <CitrusSlice className="text-azul pointer-events-none absolute -left-16 -top-16 h-52 w-52 opacity-[0.14]" />
      <CitrusSlice className="text-azul pointer-events-none absolute -bottom-20 -right-14 h-64 w-64 opacity-[0.12]" />
      <ShrimpMark className="text-naranja pointer-events-none absolute right-6 top-10 h-14 w-14 opacity-25 md:right-16 md:top-16" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="float-soft"
      >
        <img
          src="/images/logo-oficial.jpeg"
          alt="Logo oficial Los Andariegos - Buffet Mar y Tierra"
          data-testid="logo-oficial"
          className="h-52 w-52 rounded-full object-cover shadow-[0_18px_50px_-18px_rgba(18,62,133,0.45)] ring-4 ring-white md:h-64 md:w-64"
        />
      </motion.div>

      <div className="mt-8 flex items-center gap-3 text-azul">
        <Flame className="h-5 w-5" />
        <span className="font-menu text-xs font-semibold uppercase tracking-[0.5em] md:text-sm">
          Restaurante
        </span>
        <Flame className="h-5 w-5" />
      </div>

      <div className="mt-3 text-center">
        <div className="overflow-hidden">
          <motion.h1
            custom={0}
            variants={lineReveal}
            initial="hidden"
            animate="visible"
            data-testid="portada-titulo"
            className="font-display text-azul-oscuro text-4xl leading-tight sm:text-5xl lg:text-6xl"
          >
            BUFFET
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.p
            custom={1}
            variants={lineReveal}
            initial="hidden"
            animate="visible"
            className="font-display text-naranja text-2xl tracking-wide sm:text-3xl lg:text-4xl"
          >
            MAR Y TIERRA
          </motion.p>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.6 }}
        whileTap={{ scale: 0.96 }}
        onClick={onEnter}
        data-testid="ver-menu-btn"
        className="bg-azul font-menu mt-10 rounded-full px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-blue-900/20 transition-colors duration-300 hover:bg-[#123e85]"
      >
        Ver menú
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="text-azul absolute bottom-6 flex flex-col items-center gap-1 opacity-60"
      >
        <span className="font-menu text-[10px] uppercase tracking-[0.35em]">Desliza</span>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-bounce">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </header>
  );
};

export default Hero;
