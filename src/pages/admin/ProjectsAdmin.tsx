import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminChrome } from "../../components/admin/AdminChrome";
import { EmptyState, ErrorState, Loading } from "../../components/admin/States";
import { api, readError, type AdminProject } from "../../lib/adminApi";

export function ProjectsAdmin() {
  const [rows, setRows] = useState<AdminProject[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setRows(null);
    const result = await api.listProjects();
    if (!result.ok) return setError(readError(result.error));
    setRows(result.data.projects);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (row: AdminProject) => {
    if (!window.confirm(`Delete “${row.name}”? This cannot be undone.`)) return;
    setBusy(row.id);
    const result = await api.deleteProject(row.id);
    setBusy(null);
    if (!result.ok) return setError(readError(result.error));
    setRows((prev) => prev?.filter((r) => r.id !== row.id) ?? null);
  };

  return (
    <AdminChrome
      index="ADMIN"
      title="Projects"
      action={
        <Link
          to="/admin/projects/new"
          className="label label-fg inline-flex items-center gap-2 border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:bg-raised"
        >
          <Plus size={12} strokeWidth={1.75} aria-hidden />
          New project
        </Link>
      }
    >
      <section className="border-b border-line-soft">
        <div className="rail">
          {error ? (
            <ErrorState message={error} retry={load} />
          ) : !rows ? (
            <Loading text="Loading projects" />
          ) : rows.length === 0 ? (
            <EmptyState
              title="No projects yet"
              body="Add your first project and it will appear on the public site immediately."
              action={
                <Link
                  to="/admin/projects/new"
                  className="label label-fg border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:bg-raised"
                >
                  New project
                </Link>
              }
            />
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 items-center gap-3 border-b border-line-soft px-4 py-4 sm:px-6 lg:grid-cols-[70px_1fr_120px_100px_110px]"
              >
                <span className="label label-fg">{row.index}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-[16px] font-medium tracking-[-0.01em]">{row.name}</span>
                  <span className="label text-dim">/work/{row.slug}</span>
                </span>
                <span className="label">{row.status}</span>
                <span className="label inline-flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className={row.published ? "h-1.5 w-1.5 bg-fg" : "h-1.5 w-1.5 border border-strong"}
                  />
                  {row.published ? "Live" : "Hidden"}
                </span>
                <span className="flex items-center gap-2 lg:justify-end">
                  <Link
                    to={`/admin/projects/${row.id}`}
                    className="label label-fg border border-line px-2.5 py-1.5 transition-colors duration-150 hover:border-strong hover:bg-raised"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    disabled={busy === row.id}
                    aria-label={`Delete ${row.name}`}
                    className="label inline-flex items-center border border-line px-2.5 py-1.5 transition-colors duration-150 hover:border-strong hover:text-fg disabled:opacity-50"
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
