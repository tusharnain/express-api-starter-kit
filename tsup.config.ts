import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    http: 'src/http/index.ts',
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['esm'],
  target: 'node22',
  dts: false,
  minify: true,
  outDir: 'dist',
  treeshake: true, // force remove unused exports
});
