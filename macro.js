const { createMacro } = require('babel-plugin-macros');
const { addNamed } = require('@babel/helper-module-imports');
const { default: traverse } = require('@babel/traverse');
const babelPlugin = require('effector/babel-plugin');

module.exports = createMacro(logger, {
  configName: 'effectorLogger',
});

function logger({
  references,
  state,
  babel,
  config: { importModuleName = 'effector-logger', ...config } = {},
}) {
  const program = state.file.path;

  // First of all replace import path to effector-logger instead of /macro
  Object.keys(references).forEach((referenceName) => {
    const id = addNamed(program, referenceName, importModuleName, {
      nameHint: referenceName,
    });

    // Change name of method to updated
    references[referenceName].forEach((referencePath) => {
      referencePath.node.name = id.name;
    });
  });

  const instance = babelPlugin(babel, config);

  instance.pre();
  traverse(program.parent, instance.visitor, undefined, {
    ...state,
    ...instance,
  });
  instance.post();
}
