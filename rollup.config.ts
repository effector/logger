import { resolve } from 'path';
import pluginResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import Package from './package.json';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.tsx', '.ts', '.js', '.json'];

const config = ['index', 'attach', 'inspector'].map((entry) => (  {
  input: resolve(__dirname, `src/${entry}.ts`),
  output: [
    {
      file: `dist/${entry}.js`,
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
      externalLiveBindings: false
    },
    {
      file: `dist/${entry}.mjs`,
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
      externalLiveBindings: false
    }
  ],
  plugins: [
    commonjs(),
    pluginResolve({extensions}),
    typescript({
      tsconfig: './tsconfig.json'
    }),
  ],
  external: ['forest', 'foliage'].concat(
    Object.keys(Package.peerDependencies),
    Object.keys(Package.dependencies),
  ),
}));

export default config;
