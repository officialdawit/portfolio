import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { About } from "./pages/About";
import { BlogIndex } from "./pages/BlogIndex";
import { BlogPost } from "./pages/BlogPost";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Uses } from "./pages/Uses";
import { WorkDetail } from "./pages/WorkDetail";
import { WorkIndex } from "./pages/WorkIndex";

/** Public deployment. No admin route exists in this bundle at all. */
const router = createBrowserRouter([
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

export default function AppPublic() {
  return <RouterProvider router={router} />;
}
