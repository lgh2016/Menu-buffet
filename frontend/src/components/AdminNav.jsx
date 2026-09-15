import { Link } from "react-router-dom";

const AdminNav = () => (
  <nav
    data-testid="admin-nav"
    className="sticky top-0 z-40 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm"
  >
    <img src="/images/logo-oficial.jpeg" alt="Los Andariegos" className="h-9 w-9 rounded-full object-cover" />
    <span className="font-menu text-sm font-semibold uppercase tracking-widest text-gray-700">
      Administración
    </span>
    <div className="ml-auto flex items-center gap-1 text-sm">
      <Link data-testid="admin-nav-buffets" to="/admin/buffets" className="rounded-full px-3 py-1.5 font-medium text-blue-700 hover:bg-blue-50">
        Buffets
      </Link>
      <Link data-testid="admin-nav-bebidas" to="/admin/bebidas" className="rounded-full px-3 py-1.5 font-medium text-blue-700 hover:bg-blue-50">
        Bebidas
      </Link>
      <Link data-testid="admin-nav-menu" to="/" className="rounded-full px-3 py-1.5 font-medium text-gray-500 hover:bg-gray-100">
        Ver menú
      </Link>
    </div>
  </nav>
);

export default AdminNav;
