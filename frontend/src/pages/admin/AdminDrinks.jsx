import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import AdminNav from "@/components/AdminNav";
import CatalogEditor from "@/pages/admin/CatalogEditor";

const AdminDrinks = () => {
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    api.get("/drinks").then((r) => setDoc(r.data)).catch(() => toast.error("No se pudo cargar el catálogo"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      {!doc && <p className="p-8 text-center text-sm text-gray-400">Cargando...</p>}
      {doc && (
        <CatalogEditor
          doc={doc}
          title="Catálogo global de bebidas"
          subtitle="Estas bebidas se comparten en todos los buffets: un cambio aquí se refleja en el menú activo sin importar la temporada."
          onSave={async (d) => {
            try {
              await api.put("/drinks", { categories: d.categories });
              toast.success("Catálogo de bebidas guardado");
            } catch {
              toast.error("No se pudo guardar");
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminDrinks;
