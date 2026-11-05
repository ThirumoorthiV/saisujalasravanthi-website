import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import "./index.css";

const router = createBrowserRouter(routes);
const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);

// Pages are prerendered at build time (scripts/prerender.mjs); hydrate them
// rather than re-rendering. Prerendered HTML has no query string, so filtered
// URLs (?state=…) render fresh. The dev server serves an empty root.
if (container.hasChildNodes() && !window.location.search) hydrateRoot(container, app);
else createRoot(container).render(app);
