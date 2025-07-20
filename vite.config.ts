/// <reference types="vitest" />
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const isTest = command === 'serve' && mode === 'test';
  
  return {
    plugins: [
      tailwindcss(), 
      // React Routerプラグインをテスト時は無効化
      !isTest && reactRouter(), 
      tsconfigPaths()
    ].filter(Boolean),
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./app/__tests__/setup.ts"],
      include: ["app/**/*.{test,spec}.{js,jsx,ts,tsx}"],
      exclude: ["node_modules", "build", ".react-router"],
    },
  };
});
