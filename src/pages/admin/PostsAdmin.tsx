import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminChrome } from "../../components/admin/AdminChrome";
import { EmptyState, ErrorState, Loading } from "../../components/admin/States";
import { api, readError, type AdminPost } from "../../lib/adminApi";

export function PostsAdmin() {
  const [rows, setRows] = useState<AdminPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setRows(null);
    const result = await api.listPosts();
    if (!result.ok) return setError(readError(result.error));
    setRows(result.data.posts);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (row: AdminPost) => {
    if (!window.confirm(`Delete “${row.title}”? This cannot be undone.`)) return;
    setBusy(row.id);
    const result = await api.deletePost(row.id);
    setBusy(null);
    if (!result.ok) return setError(readError(result.error));
    setRows((prev) => prev?.filter((r) => r.id !== row.id) ?? null);
  };

  return (
    <AdminChrome
      index="ADMIN"
      title="Posts"
      action={
        <Link
          to="/posts/new"
          className="label label-fg inline-flex items-center gap-2 border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:bg-raised"
        >
          <Plus size={12} strokeWidth={1.75} aria-hidden />
          New post
        </Link>
      }
    >
      <section className="border-b border-line-soft">
        <div className="rail">
          {error ? (
            <ErrorState message={error} retry={load} />
          ) : !rows ? (
            <Loading text="Loading posts" />
          ) : rows.length === 0 ? (
            <EmptyState
              title="Nothing written yet"
              body="Drafts stay private until you tick published."
              action={
                <Link
                  to="/posts/new"
                  className="label label-fg border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:bg-raised"
                >
                  New post
                </Link>
              }
            />
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 items-center gap-3 border-b border-line-soft px-4 py-4 sm:px-6 lg:grid-cols-[60px_1fr_120px_100px_110px]"
              >
                <span className="label label-fg">{row.index}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-[16px] font-medium tracking-[-0.01em]">{row.title}</span>
                  <span className="label text-dim">/blog/{row.slug}</span>
                </span>
                <time className="label" dateTime={row.date}>{row.date}</time>
                <span className="label inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className={row.published ? "h-1.5 w-1.5 bg-fg" : "h-1.5 w-1.5 border border-strong"}
                  />
                  {row.published ? "Live" : "Draft"}
                </span>
                <span className="flex items-center gap-2 lg:justify-end">
                  <Link
                    to={`/admin/posts/${row.id}`}
                    className="label label-fg border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:bg-raised"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    disabled={busy === row.id}
                    aria-label={`Delete ${row.title}`}
                    className="label inline-flex items-center border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:text-fg disabled:opacity-50"
                  >
                    <Trash2 size={11} strokeWidth={1.5} aria-hidden />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </AdminChrome>
  );
}
