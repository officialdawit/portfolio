import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminAnalytics } from "./pages/admin/Analytics";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminBookings } from "./pages/admin/Bookings";
import { AdminEnquiries } from "./pages/admin/Enquiries";
import { AdminLogin } from "./pages/admin/Login";
import { PostEdit } from "./pages/admin/PostEdit";
import { PostsAdmin } from "./pages/admin/PostsAdmin";
import { ProjectEdit } from "./pages/admin/ProjectEdit";
import { ProjectsAdmin } from "./pages/admin/ProjectsAdmin";
import { RequireAuth } from "./pages/admin/RequireAuth";

/** Admin deployment. Nothing from the public site ships here. */
const router = createBrowserRouter([
  { path: "/login", element: <AdminLogin /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/", element: <AdminDashboard /> },
          { path: "/projects", element: <ProjectsAdmin /> },
          { path: "/projects/:id", element: <ProjectEdit /> },
          { path: "/posts", element: <PostsAdmin /> },
          { path: "/posts/:id", element: <PostEdit /> },
          { path: "/analytics", element: <AdminAnalytics /> },
          { path: "/enquiries", element: <AdminEnquiries /> },
          { path: "/bookings", element: <AdminBookings /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppAdmin() {
  return <RouterProvider router={router} />;
}
