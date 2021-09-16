import { resolve } from 'path';
import pluginResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import Package from './package.json';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.tsx', '.ts', '.js', '.json'];

function createBuild(input, format) {
  return {
    input: resolve(__dirname, `src/${input}.ts`),
    output: {
      file: `${input}.${format === 'esm' ? 'mjs' : 'js'}`,
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

const inputs = ['index', 'attach', 'inspector'];
const formats = ['cjs', 'esm'];

const config = inputs.map((i) => formats.map(f => createBuild(i, f))).flat();

export default config;
