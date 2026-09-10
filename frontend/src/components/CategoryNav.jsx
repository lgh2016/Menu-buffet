import { motion } from "framer-motion";

const CategoryNav = ({ categories, activeId, onSelect }) => {
  return (
    <nav
      data-testid="nav-categorias"
      className="sticky top-0 z-40 border-b border-blue-900/10 bg-[#fffdf9]/92 backdrop-blur-md"
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
              className={`font-menu shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                active
                  ? "bg-azul text-white shadow-md shadow-blue-900/20"
                  : "text-azul border border-blue-900/15 bg-white hover:border-blue-900/40"
              }`}
            >
              {cat.short}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNav;
