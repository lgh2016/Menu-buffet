import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import AdminNav from "@/components/AdminNav";
import CatalogEditor from "@/pages/admin/CatalogEditor";

const AdminBuffetEditor = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/buffets/${id}`).then((r) => setDoc(r.data)).catch(() => setNotFound(true));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      {notFound && <p className="p-8 text-center text-sm text-gray-500">Buffet no encontrado.</p>}
      {!doc && !notFound && <p className="p-8 text-center text-sm text-gray-400">Cargando...</p>}
      {doc && (
        <CatalogEditor
          key={doc.id}
          doc={doc}
          title={`Editar: ${doc.name}`}
          subtitle="Los cambios solo aplican a este buffet. Guarda para que surtan efecto."
          showName
          showTheme
          groupOptions={["cocina", "dulce"]}
          onSave={async (d) => {
            try {
              await api.put(`/buffets/${id}`, { name: d.name, theme: d.theme, categories: d.categories });
              toast.success("Buffet guardado");
            } catch {
              toast.error("No se pudo guardar");
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminBuffetEditor;
