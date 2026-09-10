import { motion } from "framer-motion";
import { Wave } from "./Decor";

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.45, ease: "easeOut" },
  }),
};

const MenuSection = ({ category }) => {
  return (
    <motion.section
      id={category.id}
      data-testid={`section-${category.id}`}
      data-nav-section={category.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="scroll-mt-24 break-inside-avoid rounded-2xl border border-blue-900/10 bg-white p-6 shadow-[0_10px_36px_-22px_rgba(18,62,133,0.35)] md:p-8"
    >
      <div className="mb-5 flex flex-wrap items-end gap-x-4 gap-y-1">
        <h2 className="font-display text-azul text-xl leading-none tracking-wide md:text-2xl">
          {category.name}
        </h2>
        {category.time && (
          <span
            data-testid={`tiempo-${category.id}`}
            className="font-menu text-azul flex flex-col text-[11px] font-bold tracking-widest"
          >
            {category.time}
            <Wave className="mt-0.5 h-2 w-14" />
          </span>
        )}
      </div>

      <ul className="space-y-2.5">
        {category.products.map((product, i) => (
          <motion.li
            key={product.name}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            className="flex items-baseline gap-2"
          >
            <span className="font-menu text-naranja text-[15px] font-semibold uppercase leading-snug tracking-wide md:text-base">
              {product.name}
            </span>
            {product.price && (
              <>
                <span className="mx-1 flex-1 border-b-2 border-dotted border-blue-900/20" aria-hidden="true" />
                <span
                  data-testid={`precio-${category.id}-${i}`}
                  className="font-menu text-azul shrink-0 text-[15px] font-bold md:text-base"
                >
                  {product.price}
                </span>
              </>
            )}
          </motion.li>
        ))}
      </ul>

      {category.sharedPrice && (
        <p
          data-testid={`precio-compartido-${category.id}`}
          className="font-menu text-azul mt-4 text-right text-base font-bold"
        >
          {category.sharedPrice}
        </p>
      )}
    </motion.section>
  );
};

export default MenuSection;
