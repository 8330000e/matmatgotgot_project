import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트에서 /api로 시작하는 요청을 보내면 백엔드(9999)로 전달합니다.
      "/api": {
        target: "http://localhost:9999",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // /api를 지우고 백엔드에 전달
      },
    },
  },
});
