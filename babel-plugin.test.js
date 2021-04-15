const { default: pluginTester } = require('babel-plugin-tester');

const baseCode = `
import { createStore, createEvent, createEffect, attach, restore } from 'effector';
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
  pluginName: 'effector-logger/babel-plugin',
  plugin: require('./babel-plugin'),
  root: __dirname,
  filename: __filename,
  babelOptions: { filename: __filename },
  snapshot: true,
  tests: {
    'replaces imports from effector': {
      code: baseCode,
    },
    'adds loc and names': {
      code: baseCode,
      pluginOptions: {
        effector: { addLoc: true, addNames: true },
      }
    },
    'adds inspector': {
      code: baseCode,
      pluginOptions: {
        inspector: true,
      }
    },
  },
});
