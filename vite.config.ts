import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "node:child_process";
import { fileURLToPath, URL } from "node:url";

/** In `npm run dev`, download CMS content again whenever staff save something in /admin/. */
function cmsWatch(): Plugin {
  return {
    name: "cms-watch",
    apply: "serve",
    configureServer(server) {
      const child = spawn(process.execPath, ["scripts/fetch-content.mjs", "--dev", "--watch"], { stdio: "inherit" });
      const stop = () => child.kill();
      server.httpServer?.on("close", stop);
      process.on("exit", stop);
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), cmsWatch()],
  build: {
    // The SSR build (prerender) leaves dependencies external, so it can't chunk them.
    rollupOptions: isSsrBuild
      ? {}
      : {
          // The CMS (login/, admin/, staff/ index.html) is a separate app, so none of its
          // code is downloaded by website visitors.
          input: {
            main: fileURLToPath(new URL("./index.html", import.meta.url)),
            login: fileURLToPath(new URL("./login/index.html", import.meta.url)),
            admin: fileURLToPath(new URL("./admin/index.html", import.meta.url)),
            staff: fileURLToPath(new URL("./staff/index.html", import.meta.url)),
          },
          output: {
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom", "react-helmet-async"],
              forms: ["react-hook-form", "@hookform/resolvers", "zod"],
            },
          },
        },
  },
  // CommonJS-only package; bundle it so Node can import its named exports.
  ssr: { noExternal: ["react-helmet-async"] },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
}));
