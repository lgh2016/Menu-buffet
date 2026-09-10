import { motion } from "framer-motion";

const PhotoBreak = ({ photos, caption }) => {
  return (
    <div data-testid={`fotos-${caption.replace(/\s+/g, "-").toLowerCase()}`} className="my-14 md:my-20">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {photos.map((photo, i) => (
          <motion.figure
            key={photo.src}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
            className={i % 2 === 1 ? "md:translate-y-6" : ""}
          >
            <div className="group overflow-hidden rounded-2xl shadow-[0_18px_44px_-20px_rgba(18,62,133,0.45)] ring-1 ring-blue-900/10">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-44 w-44 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] md:h-56 md:w-56"
              />
            </div>
            <figcaption className="font-menu text-azul mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em]">
              {photo.alt}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
};

export default PhotoBreak;
