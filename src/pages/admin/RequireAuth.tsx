import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../../components/admin/States";
import { api } from "../../lib/adminApi";

/** Client gate for UX only — every API route enforces auth server-side regardless. */
export function RequireAuth() {
  const [state, setState] = useState<"checking" | "in" | "out">("checking");

  useEffect(() => {
    void api.me().then((r) => {
      setState(r.ok && r.data.authenticated ? "in" : "out");
    });
  }, []);

  if (state === "checking") return <Loading text="Checking session" />;
  if (state === "out") return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
