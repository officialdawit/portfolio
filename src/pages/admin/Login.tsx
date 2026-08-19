import { Lock, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Field, inputClass } from "../../components/admin/AdminChrome";
import { api, readError } from "../../lib/adminApi";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);

    const result = await api.login(email, password);
    setPending(false);

    if (!result.ok) {
      setError(readError(result.error));
      return;
    }
    navigate("/");
  };

  return (
    <section className="border-b border-line-soft">
      <div className="rail flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm border border-line bg-card">
          <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
            <Lock size={12} strokeWidth={1.5} aria-hidden className="text-fg" />
            <span className="label label-fg">Admin access</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-6">
            <Field label="Email">
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>

            {error ? (
              <p role="alert" className="label border border-line px-3 py-2.5 text-fg">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="label label-fg flex min-h-11 items-center justify-center gap-2 border border-line bg-raised transition-colors duration-150 hover:border-strong disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 size={12} strokeWidth={1.75} aria-hidden className="animate-spin" />
                  Signing in
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
