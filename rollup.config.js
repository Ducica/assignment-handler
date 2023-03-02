import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".ts"];

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: "./dist/esm/index.js",
      format: "esm",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
  external: ["fs", "path", "util"],
};
