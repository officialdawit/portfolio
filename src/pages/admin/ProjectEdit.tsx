import { Loader2, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminChrome, Field, inputClass } from "../../components/admin/AdminChrome";
import { ErrorState, Loading } from "../../components/admin/States";
import { api, readError, type AdminProject } from "../../lib/adminApi";

const BLANK: Partial<AdminProject> = {
  slug: "", index: "", kind: "", name: "", headline: "", summary: "",
  status: "in build", url: "", stack: [], position: 0, published: true,
  sample: { caption: "", meta: "TS", lang: "ts", code: "" },
};

export function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState<Partial<AdminProject> | null>(isNew ? BLANK : null);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    const result = await api.listProjects();
    if (!result.ok) return setError(readError(result.error));
    const found = result.data.projects.find((p) => p.id === id);
    if (!found) return setError("That project no longer exists.");
    setForm(found);
  };

  useEffect(() => {
    if (!isNew) void load();
  }, [id]);

  const set = <K extends keyof AdminProject>(key: K, value: AdminProject[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form || saving) return;
    setSaving(true);
    setError(null);
    setIssues([]);

    const result = isNew
      ? await api.createProject(form)
      : await api.updateProject(String(id), form);
    setSaving(false);

    if (!result.ok) {
      setError(readError(result.error));
      setIssues(result.issues ?? []);
      return;
    }
    navigate("/admin/projects");
  };

  return (
    <AdminChrome index="ADMIN" title={isNew ? "New project" : "Edit project"}>
      <section className="border-b border-line-soft">
        <div className="rail px-4 py-8 sm:px-6">
          {error && !form ? (
            <ErrorState message={error} retry={load} />
          ) : !form ? (
            <Loading text="Loading project" />
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Name">
                  <input required value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Slug" hint="lowercase-hyphenated — becomes /work/slug">
                  <input required value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Index" hint="e.g. 03.1">
                  <input required value={form.index ?? ""} onChange={(e) => set("index", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Kind" hint="e.g. Event infrastructure">
                  <input required value={form.kind ?? ""} onChange={(e) => set("kind", e.target.value)} className={inputClass} />
                </Field>
              </div>

              <Field label="Headline">
                <input required value={form.headline ?? ""} onChange={(e) => set("headline", e.target.value)} className={inputClass} />
              </Field>

              <Field label="Summary">
                <textarea required rows={4} value={form.summary ?? ""} onChange={(e) => set("summary", e.target.value)} className={inputClass} />
              </Field>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Field label="Status">
                  <select value={form.status ?? "in build"} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                    <option value="live">live</option>
                    <option value="in build">in build</option>
                    <option value="private">private</option>
                  </select>
                </Field>
                <Field label="Position" hint="sort order">
                  <input type="number" value={form.position ?? 0} onChange={(e) => set("position", Number(e.target.value))} className={inputClass} />
                </Field>
                <Field label="URL" hint="https only, optional">
                  <input value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} className={inputClass} />
                </Field>
              </div>

              <Field label="Stack" hint="comma separated">
                <input
                  value={(form.stack ?? []).join(", ")}
                  onChange={(e) => set("stack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  className={inputClass}
                />
              </Field>

              <fieldset className="flex flex-col gap-5 border border-line px-4 py-5">
                <legend className="label label-fg px-2">Code sample</legend>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="Caption">
                    <input value={form.sample?.caption ?? ""} onChange={(e) => set("sample", { ...form.sample!, caption: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Meta">
                    <input value={form.sample?.meta ?? ""} onChange={(e) => set("sample", { ...form.sample!, meta: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Language">
                    <select value={form.sample?.lang ?? "ts"} onChange={(e) => set("sample", { ...form.sample!, lang: e.target.value })} className={inputClass}>
                      <option value="ts">ts</option>
                      <option value="bash">bash</option>
                      <option value="sql">sql</option>
                    </select>
                  </Field>
                </div>
                <Field label="Code">
                  <textarea rows={10} value={form.sample?.code ?? ""} onChange={(e) => set("sample", { ...form.sample!, code: e.target.value })} className={inputClass} />
                </Field>
              </fieldset>

              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.published ?? true} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-white" />
                <span className="label label-fg">Published — visible on the public site</span>
              </label>

              {error ? (
                <div role="alert" className="flex flex-col gap-2 border border-line px-3 py-3">
                  <p className="label label-fg">{error}</p>
                  {issues.map((i) => (
                    <p key={i} className="label text-muted">— {i}</p>
                  ))}
                </div>
              ) : null}

              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="label label-fg inline-flex min-h-11 items-center gap-2 border border-line bg-raised px-4 transition-colors duration-150 hover:border-strong disabled:opacity-60">
                  {saving ? <Loader2 size={12} strokeWidth={1.75} aria-hidden className="animate-spin" /> : <Save size={12} strokeWidth={1.75} aria-hidden />}
                  {saving ? "Saving" : "Save"}
                </button>
                <button type="button" onClick={() => navigate("/admin/projects")} className="label inline-flex min-h-11 items-center border border-line px-4 transition-colors duration-150 hover:border-strong hover:text-fg">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </AdminChrome>
  );
}
