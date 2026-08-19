import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { AdminAnalytics } from "./pages/admin/Analytics";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminLogin } from "./pages/admin/Login";
import { PostEdit } from "./pages/admin/PostEdit";
import { PostsAdmin } from "./pages/admin/PostsAdmin";
import { ProjectEdit } from "./pages/admin/ProjectEdit";
import { ProjectsAdmin } from "./pages/admin/ProjectsAdmin";
import { RequireAuth } from "./pages/admin/RequireAuth";
import { AdminLayout } from "./components/admin/AdminLayout";
import { About } from "./pages/About";
import { BlogIndex } from "./pages/BlogIndex";
import { BlogPost } from "./pages/BlogPost";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Uses } from "./pages/Uses";
import { WorkDetail } from "./pages/WorkDetail";
import { WorkIndex } from "./pages/WorkIndex";

const router = createBrowserRouter([
  { path: "/admin/login", element: <AdminLogin /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/projects", element: <ProjectsAdmin /> },
          { path: "/admin/projects/:id", element: <ProjectEdit /> },
          { path: "/admin/posts", element: <PostsAdmin /> },
          { path: "/admin/posts/:id", element: <PostEdit /> },
          { path: "/admin/analytics", element: <AdminAnalytics /> },
        ],
      },
    ],
  },
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/work", element: <WorkIndex /> },
      { path: "/work/:slug", element: <WorkDetail /> },
      { path: "/blog", element: <BlogIndex /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/about", element: <About /> },
      { path: "/uses", element: <Uses /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
