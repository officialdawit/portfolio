import { Loader2, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminChrome, Field, inputClass } from "../../components/admin/AdminChrome";
import { ErrorState, Loading } from "../../components/admin/States";
import { api, readError, type AdminPost } from "../../lib/adminApi";

const BLANK: Partial<AdminPost> = {
  slug: "", index: "", title: "", standfirst: "", date: "", reading: "5 min",
  tags: [], blocks: [], position: 0, published: false,
};

export function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState<Partial<AdminPost> | null>(isNew ? BLANK : null);
  const [blocksText, setBlocksText] = useState("[]");
  const [blocksValid, setBlocksValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    const result = await api.listPosts();
    if (!result.ok) return setError(readError(result.error));
    const found = result.data.posts.find((p) => p.id === id);
    if (!found) return setError("That post no longer exists.");
    setForm(found);
    setBlocksText(JSON.stringify(found.blocks, null, 2));
  };

  useEffect(() => {
    if (!isNew) void load();
  }, [id]);

  const set = <K extends keyof AdminPost>(key: K, value: AdminPost[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleBlocks = (text: string) => {
    setBlocksText(text);
    try {
      const parsed = JSON.parse(text);
      setBlocksValid(Array.isArray(parsed));
      if (Array.isArray(parsed)) set("blocks", parsed);
    } catch {
      setBlocksValid(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form || saving || !blocksValid) return;
    setSaving(true);
    setError(null);
    setIssues([]);

    const result = isNew ? await api.createPost(form) : await api.updatePost(String(id), form);
    setSaving(false);

    if (!result.ok) {
      setError(readError(result.error));
      setIssues(result.issues ?? []);
      return;
    }
    navigate("/admin/posts");
  };

  return (
    <AdminChrome index="ADMIN" title={isNew ? "New post" : "Edit post"}>
      <section className="border-b border-line-soft">
        <div className="rail px-4 py-8 sm:px-6">
          {error && !form ? (
            <ErrorState message={error} retry={load} />
          ) : !form ? (
            <Loading text="Loading post" />
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
              <Field label="Title">
                <input required value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputClass} />
              </Field>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Slug" hint="becomes /blog/slug">
                  <input required value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Index" hint="e.g. 04">
                  <input required value={form.index ?? ""} onChange={(e) => set("index", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Date" hint="YYYY-MM-DD">
                  <input required placeholder="2026-08-19" value={form.date ?? ""} onChange={(e) => set("date", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Reading time">
                  <input value={form.reading ?? ""} onChange={(e) => set("reading", e.target.value)} className={inputClass} />
                </Field>
              </div>

              <Field label="Standfirst">
                <textarea rows={3} value={form.standfirst ?? ""} onChange={(e) => set("standfirst", e.target.value)} className={inputClass} />
              </Field>

              <Field label="Tags" hint="comma separated">
                <input
                  value={(form.tags ?? []).join(", ")}
                  onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Blocks"
                hint='JSON array. Types: {"type":"p","text":""} · "h" · {"type":"list","items":[]} · {"type":"note","text":""} · {"type":"code","caption":"","meta":"","lang":"ts","code":""}'
              >
                <textarea
                  rows={16}
                  value={blocksText}
                  onChange={(e) => handleBlocks(e.target.value)}
                  className={`${inputClass} ${blocksValid ? "" : "border-fg"}`}
                />
              </Field>
              {!blocksValid ? (
                <p role="alert" className="label border border-line px-3 py-2 text-fg">
                  Blocks must be valid JSON array — saving is blocked until this parses.
                </p>
              ) : null}

              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.published ?? false} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-white" />
                <span className="label label-fg">Published — visible at /blog</span>
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
                <button type="submit" disabled={saving || !blocksValid} className="label label-fg inline-flex min-h-11 items-center gap-2 border border-line bg-raised px-4 transition-colors duration-150 hover:border-strong disabled:opacity-60">
                  {saving ? <Loader2 size={12} strokeWidth={1.75} aria-hidden className="animate-spin" /> : <Save size={12} strokeWidth={1.75} aria-hidden />}
                  {saving ? "Saving" : "Save"}
                </button>
                <button type="button" onClick={() => navigate("/admin/posts")} className="label inline-flex min-h-11 items-center border border-line px-4 transition-colors duration-150 hover:border-strong hover:text-fg">
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
