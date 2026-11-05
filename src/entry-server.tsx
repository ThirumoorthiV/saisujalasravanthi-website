import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom/server";
import { SITE } from "./data/site";
import { routes } from "./routes";

export const SITE_URL = SITE.url;

const handler = createStaticHandler(routes);

/** Renders one URL to HTML for the build-time prerender (scripts/prerender.mjs). */
export async function render(url: string) {
  const context = await handler.query(new Request(new URL(url, "http://localhost")));
  if (context instanceof Response) throw new Error(`${url} redirected — routes to prerender must render a page`);

  const router = createStaticRouter(handler.dataRoutes, context);
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        {/* No route loaders, so there's no data to hand to the client */}
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </HelmetProvider>
    </StrictMode>,
  );
  const h = helmetContext.helmet!;
  const head = [h.title, h.meta, h.link, h.script].map((part) => part.toString()).join("");
  return { html, head };
}
