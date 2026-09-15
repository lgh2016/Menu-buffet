import { motion } from "framer-motion";
import { Flame, ShrimpMark } from "../Decor";

const EMBERS = [
  { left: "6%", delay: "0s", dur: "10s" },
  { left: "16%", delay: "3.5s", dur: "12s" },
  { left: "28%", delay: "1.2s", dur: "9s" },
  { left: "42%", delay: "5s", dur: "11s" },
  { left: "55%", delay: "2.2s", dur: "10s" },
  { left: "68%", delay: "6.4s", dur: "12s" },
  { left: "80%", delay: "0.8s", dur: "9.5s" },
  { left: "92%", delay: "4.2s", dur: "11s" },
];

const SeptHero = ({ onEnter, title, subtitle }) => {
  return (
    <header
      data-testid="portada"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <img
        src="/images/fondo-jinetes.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,8,6,0.74) 0%, rgba(10,8,6,0.42) 45%, rgba(13,11,9,0.97) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="papel-picado absolute inset-x-0 top-0" aria-hidden="true" />
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{ left: e.left, animationDelay: e.delay, animationDuration: e.dur }}
          aria-hidden="true"
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <img
          src="/images/logo-oficial.jpeg"
          alt="Logo oficial Los Andariegos - Buffet Mar y Tierra"
          data-testid="logo-oficial"
          className="h-44 w-44 rounded-full object-cover ring-2 ring-[#c9a227]/70 shadow-[0_0_70px_-10px_rgba(224,160,74,0.55)] md:h-56 md:w-56"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="font-menu relative mt-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.5em] text-[#c9a227]"
      >
        <Flame className="h-4 w-4" />
        Los Andariegos presenta
        <Flame className="h-4 w-4" />
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        data-testid="portada-titulo"
        className="font-display relative mt-4 max-w-3xl text-3xl leading-tight text-[#f5efe0] sm:text-5xl lg:text-6xl"
      >
        {title || "EDICIÓN ESPECIAL 15 DE SEPTIEMBRE"}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-5 flex h-1 w-44 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        <span className="flex-1 bg-[#0f7a44]" />
        <span className="flex-1 bg-[#f3ead3]" />
        <span className="flex-1 bg-[#a52633]" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="font-menu relative mt-5 max-w-md text-sm font-medium uppercase tracking-[0.2em] text-[#d8c69a] md:text-base"
      >
        {subtitle || "Tradición, sabor y celebración al estilo Los Andariegos"}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        whileTap={{ scale: 0.96 }}
        onClick={onEnter}
        data-testid="ver-menu-btn"
        className="font-menu relative mt-10 rounded-full bg-[#c9a227] px-10 py-3.5 text-sm font-bold uppercase tracking-[0.25em] text-[#14100b] shadow-[0_14px_40px_-12px_rgba(201,162,39,0.55)] transition-colors duration-300 hover:bg-[#d9b45b]"
      >
        Ver el festín
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-6 flex flex-col items-center gap-1 text-[#c9a227]/70"
      >
        <span className="font-menu text-[10px] uppercase tracking-[0.35em]">Desliza</span>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-bounce">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <ShrimpMark className="pointer-events-none absolute left-6 top-14 h-14 w-14 text-[#c9a227]/25 md:left-16" aria-hidden="true" />
    </header>
  );
};

export default SeptHero;
