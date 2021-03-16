const { default: pluginTester } = require('babel-plugin-tester');

const baseCode = `
import { createStore, createEvent, createEffect, attach, restore } from './macro';
const fx = createEffect(() => 1);
const $data = createStore(0);
const was = createEvent();
const anotherFx = attach({
  effect: fx,
  source: $data,
  mapParams: (a) => a,
})
const $has = restore(was, "");
`;

pluginTester({
  pluginName: 'effector-logger/macro',
  plugin: require('babel-plugin-macros'),
  root: __dirname,
  filename: __filename,
  babelOptions: { filename: __filename },
  snapshot: true,
  tests: {
    'add sid': {
      code: baseCode,
    },
    'add sid and loc': {
      code: baseCode,
      pluginOptions: {
        effectorLogger: {
          addLoc: true,
          addNames: true,
        },
      },
    },
  },
});
