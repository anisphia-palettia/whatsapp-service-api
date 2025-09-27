import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],   // titik masuk project
    outDir: "dist",            // output folder
    format: ["esm", "cjs"],    // build ke ESM + CommonJS
    sourcemap: true,           // biar gampang debug
    clean: true,               // bersihin dist sebelum build
    dts: true,                 // generate .d.ts
    splitting: false,          // biasanya false buat lib kecil / backend
    minify: false,             // kalau backend biasanya nggak usah minify
    target: "es2021",          // sesuai tsconfig target
    skipNodeModulesBundle: true
});
