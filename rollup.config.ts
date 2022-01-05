import { resolve } from 'path';
import fs from "fs";
import pluginResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import Package from './package.json';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.tsx', '.ts', '.js', '.json'];

function createBuild(input, format, base = "") {
  const file = `${base}${input}.${format === 'esm' ? 'mjs' : 'js'}`;

  return {
    input: resolve(__dirname, `src/${input}.ts`),
    output: {
      file,
      format,
      plugins: [terser()],
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      pluginResolve({extensions}),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      babel({
        babelHelpers: 'bundled',
        extensions,
        skipPreflightCheck: true,
        babelrc: false,
        ...require('./babel.config').generateConfig({
          isEsm: format === 'esm'
        })
      })
    ],
    external: ['forest/forest.mjs', 'effector/effector.mjs', 'effector-inspector/index.mjs'].concat(
      Object.keys(Package.peerDependencies),
      Object.keys(Package.dependencies),
    ),
  }
}

const outputBase = process.env.BUILD_KIND === "integration" ? ["dist-test/"] : [""]
const inputs = ['index', 'attach', 'inspector'];
const formats = ['cjs', 'esm'];

const config = outputBase.map(o => inputs.map((i) => formats.map(f => createBuild(i, f, o)))).flat().flat();

export default config;
