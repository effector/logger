/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import fs from 'fs';
import { promisify } from 'util';
import { rollup, InputOptions, OutputOptions } from 'rollup';
import { resolve } from 'path';
import pluginResolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import Package from '../package.json';
import typescript from '@rollup/plugin-typescript';
import babelConfig from '../babel.config';

const DIR = 'dist/';
const LIB_NAME = process.env.LIB_NAME ?? Package.name;
const copyTargets = ['babel-plugin.js', 'macro.js', 'macro.d.ts'];

async function build(): Promise<void> {
  const configs = getAllConfigs();

  for (const config of configs) {
    await buildEntry(config);
  }
  const packageJson = JSON.parse(JSON.stringify(Package));
  packageJson.name = LIB_NAME;
  delete packageJson.scripts.prepublish;
  delete packageJson.devDependencies;
  await saveFile(`${DIR}package.json`, JSON.stringify(packageJson));
  for (const target of copyTargets) {
    await copyFile(resolve(__dirname, '../' + target), resolve(__dirname, '../' + DIR + target));
  }
}

async function buildEntry(config: ReturnType<typeof getConfig>) {
  console.log('building: ', `src/${config.name}.ts`, '->', config.format);
  const bundle = await rollup(config.input);
  console.log('saving: ', config.output.file);
  await bundle.write(config.output);
  console.log('');
}

const entrypoints = ['index', 'attach', 'inspector'] as const;
const formats = ['cjs', 'esm'] as const;

function getAllConfigs() {
  const configs: ReturnType<typeof getConfig>[] = [];
  entrypoints.forEach((name) => {
    formats.forEach((format) => {
      configs.push(
        getConfig({
          name,
          format,
          base: DIR,
        }),
      );
    });
  });

  return configs;
}

function getConfig(config: { name: string; format: 'esm' | 'cjs'; base: string }) {
  const { name, format, base } = config;
  const input = getInput(name, format);
  const output = getOutput(name, format, base);

  return {
    input,
    output,
    name,
    format,
  };
}

const extensions = ['.tsx', '.ts', '.js', '.json'];
const external = [
  'forest/forest.mjs',
  'effector/effector.mjs',
  'effector-inspector/index.mjs',
].concat(Object.keys(Package.peerDependencies), Object.keys(Package.dependencies));

function getInput(name: string, format: 'esm' | 'cjs'): InputOptions {
  const input = resolve(__dirname, `../src/${name}.ts`);
  const plugins = [
    commonjs(),
    pluginResolve({ extensions }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    babel({
      babelHelpers: 'bundled',
      extensions,
      skipPreflightCheck: true,
      babelrc: false,
      ...babelConfig.generateConfig({
        isEsm: format === 'esm',
      }),
    }),
  ];
  return {
    input,
    plugins,
    external,
  };
}

function getOutput(name: string, format: 'esm' | 'cjs', base = ''): OutputOptions {
  const file = `${base}${name}.${format === 'esm' ? 'mjs' : 'js'}`;
  return {
    file,
    sourcemap: true,
    format,
  };
}

const saveFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);

build()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(-1);
  });
