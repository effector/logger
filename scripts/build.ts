/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { rollup, InputOptions, OutputOptions } from 'rollup';
import { resolve } from 'path';
import pluginResolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import Package from '../package.json';
import typescript from '@rollup/plugin-typescript';
import babelConfig from "../babel.config";

const extensions = ['.tsx', '.ts', '.js', '.json'];
const external = [
  'forest/forest.mjs',
  'effector/effector.mjs',
  'effector-inspector/index.mjs',
].concat(Object.keys(Package.peerDependencies), Object.keys(Package.dependencies));

const buildKind = process.env.BUILD_KIND;
const isIntegration = buildKind === 'integration';

const entrypoints = ['index', 'attach', 'inspector'] as const;
const formats = ['cjs', 'esm'] as const;

async function build(): Promise<void> {
  const configs = getAllConfigs();

  for (const config of configs) {
      await buildEntry(config);
  }
}

async function buildEntry(config: ReturnType<typeof getConfig>) {
  console.log("building: ", `src/${config.name}.ts`, "->", config.format)
  const bundle = await rollup(config.input);
  console.log("saving: ", config.output.file)
  await bundle.write(config.output);
  console.log("")
}

function getAllConfigs() {
  const configs: ReturnType<typeof getConfig>[] = [];
  entrypoints.forEach((name) => {
    formats.forEach((format) => {
      configs.push(
        getConfig({
          name,
          format,
          base: isIntegration ? 'dist-test/' : '',
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

build()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(-1);
  });
