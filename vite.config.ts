import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // The SSR build (prerender) leaves dependencies external, so it can't chunk them.
    rollupOptions: isSsrBuild
      ? {}
      : {
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
