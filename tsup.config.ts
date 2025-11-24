import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],   // main entry
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,                 // generate type declarations
  clean: true,
  sourcemap: true,
  minify: false
});
