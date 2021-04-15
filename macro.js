const { createMacro } = require('babel-plugin-macros');
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
    const newName = addImport(babel.types, program, referenceName, importModuleName);

    // Change name of method to updated
    references[referenceName].forEach((referencePath) => {
      referencePath.node.name = newName;
    });
  });

  const instance = babelPlugin(babel, config);

  instance.pre();
  babel.traverse(program.parent, instance.visitor, undefined, {
    ...state,
    ...instance,
  });
  instance.post();
}

function addImport(t, programPath, specifierName, importPath) {
  const [newPath] = programPath.unshiftContainer(
    'body',
    t.importDeclaration(
      [
        t.importSpecifier(
          programPath.scope.generateUidIdentifier(specifierName),
          t.identifier(specifierName),
        ),
      ],
      t.stringLiteral(importPath),
    ),
  );

  let found;

  newPath.get('specifiers').forEach((specifier) => {
    if (specifier.node.imported.name === specifierName) {
      found = specifier;
    }
  });

  programPath.scope.registerBinding('module', found);
  return found.node.local.name;
}
