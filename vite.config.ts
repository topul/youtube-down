import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: join(__dirname, "renderer"),
  plugins: [vue()],
  optimizeDeps: {
    exclude: ["electron"],
  },
});
