import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import AdminNav from "@/components/AdminNav";
import { CheckCircle2, Copy, Pencil, Plus, Power, PowerOff } from "lucide-react";

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "—";

const AdminBuffets = () => {
  const [buffets, setBuffets] = useState([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [sourceId, setSourceId] = useState("");
  const navigate = useNavigate();

  const load = () =>
    api.get("/buffets").then((r) => setBuffets(r.data)).catch(() => toast.error("No se pudo cargar la lista"));

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    try {
      const { data } = await api.post("/buffets", { name: name.trim(), sourceId: sourceId || null });
      toast.success("Buffet creado");
      navigate(`/admin/buffets/${data.id}`);
    } catch {
      toast.error("No se pudo crear el buffet");
    }
  };

  const duplicate = async (b) => {
    try {
      const { data } = await api.post(`/buffets/${b.id}/duplicate`, { name: `${b.name} (copia)` });
      toast.success(`Copia independiente de "${b.name}" creada`);
      navigate(`/admin/buffets/${data.id}`);
    } catch {
      toast.error("No se pudo duplicar");
    }
  };

  const activate = async (b) => {
    try {
      await api.post(`/buffets/${b.id}/activate`);
      toast.success(`"${b.name}" ahora es el menú que ven los clientes`);
      load();
    } catch {
      toast.error("No se pudo activar");
    }
  };

  const deactivate = async (b) => {
    try {
      await api.post(`/buffets/${b.id}/deactivate`);
      toast.success("Buffet desactivado");
      load();
    } catch {
      toast.error("No se pudo desactivar");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-menu text-xl font-bold uppercase tracking-wide text-gray-800">
              Administración de Buffet
            </h1>
            <p className="text-sm text-gray-500">
              Solo un buffet puede estar activo; al activar uno, el anterior pasa a inactivo sin borrarse.
            </p>
          </div>
          <button
            data-testid="crear-buffet-btn"
            onClick={() => setCreating((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" /> Crear buffet
          </button>
        </div>

        {creating && (
          <div data-testid="crear-buffet-panel" className="mb-6 rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
            <h2 className="font-menu mb-3 text-sm font-bold uppercase tracking-widest text-gray-700">
              Nuevo buffet
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                data-testid="crear-buffet-nombre"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                placeholder="Nombre (ej. Buffet Navideño)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select
                data-testid="crear-buffet-origen"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
              >
                <option value="">Crear buffet vacío</option>
                {buffets.map((b) => (
                  <option key={b.id} value={b.id}>
                    Duplicar: {b.name}
                  </option>
                ))}
              </select>
              <button
                data-testid="crear-buffet-confirmar"
                onClick={create}
                className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {buffets.map((b) => (
            <div
              key={b.id}
              data-testid={`buffet-card-${b.id}`}
              className={`rounded-xl border bg-white p-5 shadow-sm ${b.active ? "border-green-400 ring-1 ring-green-300" : "border-gray-200"}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-menu text-lg font-bold text-gray-800">{b.name}</h2>
                {b.active ? (
                  <span
                    data-testid={`buffet-estado-${b.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Activo
                  </span>
                ) : (
                  <span
                    data-testid={`buffet-estado-${b.id}`}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    Inactivo
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Creado: {fmt(b.createdAt)} · Última modificación: {fmt(b.updatedAt)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  data-testid={`buffet-editar-${b.id}`}
                  onClick={() => navigate(`/admin/buffets/${b.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  data-testid={`buffet-duplicar-${b.id}`}
                  onClick={() => duplicate(b)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicar
                </button>
                {b.active ? (
                  <button
                    data-testid={`buffet-desactivar-${b.id}`}
                    onClick={() => deactivate(b)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                  >
                    <PowerOff className="h-3.5 w-3.5" /> Desactivar
                  </button>
                ) : (
                  <button
                    data-testid={`buffet-activar-${b.id}`}
                    onClick={() => activate(b)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    <Power className="h-3.5 w-3.5" /> Usar este buffet
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminBuffets;
