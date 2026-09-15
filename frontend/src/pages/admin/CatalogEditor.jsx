import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Plus, Save, Trash2 } from "lucide-react";

const inputCls =
  "w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm focus:border-blue-600 focus:outline-none";
const smallBtn =
  "inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50";

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `cat-${Date.now()}`;

const ImageField = ({ value, onChange, testId }) => {
  const fileRef = useRef(null);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd);
      onChange(data.url);
      toast.success("Imagen subida");
    } catch {
      toast.error("No se pudo subir la imagen");
    }
  };
  return (
    <div className="flex items-center gap-2">
      {value ? (
        <img src={value} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-gray-200" />
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-md bg-gray-100" />
      )}
      <input
        data-testid={testId}
        className={inputCls}
        placeholder="URL de imagen (opcional)"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
      />
      <button type="button" className={smallBtn} onClick={() => fileRef.current?.click()}>
        <ImagePlus className="h-3.5 w-3.5" /> Subir
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
    </div>
  );
};

const CatalogEditor = ({ doc, onSave, title, subtitle, showName = false, showTheme = false, groupOptions = null }) => {
  const [data, setData] = useState(doc);
  const [saving, setSaving] = useState(false);
  const cats = data.categories;

  const setCats = (next) => setData((d) => ({ ...d, categories: next }));
  const patchCat = (i, patch) => setCats(cats.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const moveIn = (arr, i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  };
  const patchProduct = (ci, pi, patch) =>
    patchCat(ci, { products: cats[ci].products.map((p, idx) => (idx === pi ? { ...p, ...patch } : p)) });
  const moveProductTo = (ci, pi, targetId) => {
    const target = cats.findIndex((c) => c.id === targetId);
    if (target < 0 || target === ci) return;
    const prod = cats[ci].products[pi];
    setCats(
      cats.map((c, idx) => {
        if (idx === ci) return { ...c, products: c.products.filter((_, p) => p !== pi) };
        if (idx === target) return { ...c, products: [...c.products, prod] };
        return c;
      })
    );
  };

  const addCategory = () =>
    setCats([
      ...cats,
      {
        id: slugify(`categoria-${cats.length + 1}-${Date.now()}`),
        name: "NUEVA CATEGORIA",
        short: "Nueva",
        time: null,
        sharedPrice: null,
        group: groupOptions ? groupOptions[0] : "cocina",
        hidden: false,
        products: [],
      },
    ]);

  const save = async () => {
    setSaving(true);
    try {
      const normalized = {
        ...data,
        categories: data.categories.map((c) => ({
          ...c,
          time: c.time?.trim() || null,
          sharedPrice: c.sharedPrice?.trim() || null,
          products: c.products.map((p) => ({
            ...p,
            price: p.price?.trim() ? p.price.trim() : null,
            description: p.description?.trim() || null,
            image: p.image || null,
          })),
        })),
      };
      await onSave(normalized);
    } finally {
      setSaving(false);
    }
  };

  const theme = data.theme || {};

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-6">
      <h1 className="font-menu text-xl font-bold uppercase tracking-wide text-gray-800">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}

      {showName && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5">
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-500">
            Nombre del buffet
          </label>
          <input
            data-testid="editor-nombre"
            className={inputCls}
            value={data.name}
            onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
          />
        </div>
      )}

      {showTheme && (
        <div data-testid="editor-tema" className="mt-5 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-menu mb-4 text-sm font-bold uppercase tracking-widest text-gray-700">
            Personalización
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Título</label>
              <input
                data-testid="tema-titulo"
                className={inputCls}
                value={theme.title || ""}
                onChange={(e) => setData((d) => ({ ...d, theme: { ...d.theme, title: e.target.value } }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Subtítulo</label>
              <input
                data-testid="tema-subtitulo"
                className={inputCls}
                value={theme.subtitle || ""}
                onChange={(e) => setData((d) => ({ ...d, theme: { ...d.theme, subtitle: e.target.value } }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Plantilla visual</label>
              <select
                data-testid="tema-plantilla"
                className={inputCls}
                value={theme.template || "classic"}
                onChange={(e) => setData((d) => ({ ...d, theme: { ...d.theme, template: e.target.value } }))}
              >
                <option value="classic">Clásica (Los Andariegos)</option>
                <option value="mexican-independence">Edición 15 de Septiembre</option>
              </select>
            </div>
            {[
              ["primaryColor", "Color principal (títulos y precios)", "tema-color-principal"],
              ["secondaryColor", "Color secundario (nombres de platillos)", "tema-color-secundario"],
              ["backgroundColor", "Color de fondo", "tema-color-fondo"],
            ].map(([key, label, testId]) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  data-testid={testId}
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded-md border border-gray-300"
                  value={theme[key] || "#ffffff"}
                  onChange={(e) => setData((d) => ({ ...d, theme: { ...d.theme, [key]: e.target.value } }))}
                />
                <span className="text-xs font-semibold text-gray-500">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {[
              ["heroImage", "Imagen principal / hero", "tema-hero"],
              ["backgroundImage", "Imagen de fondo", "tema-fondo"],
              ["banner", "Banner", "tema-banner"],
              ["decorativeImage", "Imagen decorativa (opcional)", "tema-decorativa"],
            ].map(([key, label, testId]) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-semibold text-gray-500">{label}</label>
                <ImageField
                  testId={testId}
                  value={theme[key]}
                  onChange={(url) => setData((d) => ({ ...d, theme: { ...d.theme, [key]: url } }))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {cats.map((cat, ci) => (
          <div
            key={cat.id}
            data-testid={`editor-cat-${cat.id}`}
            className={`rounded-xl border border-gray-200 bg-white p-5 ${cat.hidden ? "opacity-60" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <input
                data-testid={`cat-nombre-${cat.id}`}
                className={`${inputCls} max-w-xs font-semibold uppercase`}
                value={cat.name}
                onChange={(e) => patchCat(ci, { name: e.target.value })}
              />
              <input
                className={`${inputCls} w-28`}
                placeholder="Etiqueta corta"
                value={cat.short || ""}
                onChange={(e) => patchCat(ci, { short: e.target.value })}
              />
              <input
                className={`${inputCls} w-24`}
                placeholder="Tiempo"
                value={cat.time || ""}
                onChange={(e) => patchCat(ci, { time: e.target.value })}
              />
              <input
                className={`${inputCls} w-28`}
                placeholder="Precio único"
                value={cat.sharedPrice || ""}
                onChange={(e) => patchCat(ci, { sharedPrice: e.target.value })}
              />
              {groupOptions && (
                <select
                  className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                  value={cat.group}
                  onChange={(e) => patchCat(ci, { group: e.target.value })}
                >
                  {groupOptions.map((g) => (
                    <option key={g} value={g}>
                      {g === "cocina" ? "De la cocina" : "Para el antojo"}
                    </option>
                  ))}
                </select>
              )}
              <div className="ml-auto flex items-center gap-1.5">
                <button data-testid={`cat-toggle-${cat.id}`} className={smallBtn} onClick={() => patchCat(ci, { hidden: !cat.hidden })}>
                  {cat.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {cat.hidden ? "Oculta" : "Visible"}
                </button>
                <button className={smallBtn} onClick={() => setCats(moveIn(cats, ci, -1))}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button className={smallBtn} onClick={() => setCats(moveIn(cats, ci, 1))}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  data-testid={`cat-eliminar-${cat.id}`}
                  className={`${smallBtn} text-red-600 hover:bg-red-50`}
                  onClick={() => setCats(cats.filter((_, idx) => idx !== ci))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {cat.products.map((p, pi) => (
                <div
                  key={pi}
                  data-testid={`editor-prod-${cat.id}-${pi}`}
                  className={`rounded-lg border border-gray-100 bg-gray-50 p-3 ${p.hidden ? "opacity-50" : ""}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      className={`${inputCls} max-w-xs font-medium uppercase`}
                      value={p.name}
                      onChange={(e) => patchProduct(ci, pi, { name: e.target.value })}
                    />
                    <input
                      data-testid={`prod-precio-${cat.id}-${pi}`}
                      className={`${inputCls} w-20`}
                      placeholder="$"
                      value={p.price || ""}
                      onChange={(e) => patchProduct(ci, pi, { price: e.target.value })}
                    />
                    <select
                      className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                      value={cat.id}
                      onChange={(e) => moveProductTo(ci, pi, e.target.value)}
                      title="Mover a otra categoría"
                    >
                      {cats.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="ml-auto flex items-center gap-1.5">
                      <button className={smallBtn} onClick={() => patchProduct(ci, pi, { hidden: !p.hidden })}>
                        {p.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        className={smallBtn}
                        onClick={() => patchCat(ci, { products: moveIn(cat.products, pi, -1) })}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className={smallBtn}
                        onClick={() => patchCat(ci, { products: moveIn(cat.products, pi, 1) })}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className={`${smallBtn} text-red-600 hover:bg-red-50`}
                        onClick={() => patchCat(ci, { products: cat.products.filter((_, idx) => idx !== pi) })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input
                      className={inputCls}
                      placeholder="Descripción (opcional)"
                      value={p.description || ""}
                      onChange={(e) => patchProduct(ci, pi, { description: e.target.value })}
                    />
                    <ImageField
                      testId={`prod-imagen-${cat.id}-${pi}`}
                      value={p.image}
                      onChange={(url) => patchProduct(ci, pi, { image: url })}
                    />
                  </div>
                </div>
              ))}
              <button
                data-testid={`cat-agregar-prod-${cat.id}`}
                className={smallBtn}
                onClick={() =>
                  patchCat(ci, {
                    products: [...cat.products, { name: "NUEVO PLATILLO", price: null, description: null, image: null, hidden: false }],
                  })
                }
              >
                <Plus className="h-3.5 w-3.5" /> Agregar platillo
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        data-testid="editor-agregar-categoria"
        onClick={addCategory}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-blue-400 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
      >
        <Plus className="h-4 w-4" /> Agregar categoría
      </button>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl justify-end">
          <button
            data-testid="editor-guardar"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogEditor;
