export const CitrusSlice = ({ className = "", style }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} style={style} aria-hidden="true">
    <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="5" />
    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      const x1 = 50 + Math.cos(a) * 6;
      const y1 = 50 + Math.sin(a) * 6;
      const x2 = 50 + Math.cos(a) * 36;
      const y2 = 50 + Math.sin(a) * 36;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.5" />;
    })}
    <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const Wave = ({ className = "" }) => (
  <svg viewBox="0 0 120 12" fill="none" className={className} aria-hidden="true" preserveAspectRatio="none">
    <path
      d="M2 8 Q 8 2, 14 8 T 26 8 T 38 8 T 50 8 T 62 8 T 74 8 T 86 8 T 98 8 T 110 8 T 122 8"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const Flame = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2c1 3-2 4.5-2 7a4 4 0 0 0 8 0c0-1.5-.5-2.5-1.5-3.5C16 7 15 8 14.5 8 15.5 5.5 14 3 12 2Zm-3.5 9C7 13 6 14.5 6 16.5A6 6 0 0 0 18 16.5c0-1.2-.3-2.2-.8-3a5.5 5.5 0 0 1-8.7-2.5Z" />
  </svg>
);

export const ShrimpMark = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path
      d="M44 10c-12 0-24 8-26 22-1 8 3 15 10 18 8 3 17 0 21-7 3-5 2-11-2-14-4-4-11-4-14 0"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path d="M44 10l8-6M44 10l10 1" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="40" cy="34" r="2.4" fill="currentColor" />
  </svg>
);
