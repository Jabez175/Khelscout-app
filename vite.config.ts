import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // FIX: The `process.cwd()` call was causing a TypeScript type error because `process` was not fully typed.
          // Replaced `path.resolve(process.cwd())` with `path.resolve()`, which returns the current
          // working directory without referencing `process` directly.
          '@': path.resolve(),
        }
      }
    };
});
