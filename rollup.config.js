import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import cleaner from 'rollup-plugin-cleaner';
import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';

import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const availibleFiles = ['.ts', '.tsx', '.json'];

export default {
  input: 'src',
  output: [
    {
      file: 'dist/common.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    cleaner({
      targets: ['dist'],
    }),
    alias({
      entries: {
        components: './components',
      },
      resolve: availibleFiles,
    }),
    eslint(),
    typescript({ rollupCommonJSResolveHack: true, clean: true }),
    resolve({
      extensions: availibleFiles,
    }),
    commonjs(),
    terser(),
  ],
};
