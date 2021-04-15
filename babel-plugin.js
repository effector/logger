const effectorPlugin = require('effector/babel-plugin');

module.exports = function effectorLogger(babel, options = {}) {
  const { types: t } = babel;
  const { inspector = false, effector = {}, skipEffectorPlugin = false } = options;

  const replaceToLogger = ['effector'];

  const importVisitor = {
    ImportDeclaration(path, state) {
      if (t.isLiteral(path.node.source)) {
        // If imported from module that should be replaced to logger as is
        if (replaceToLogger.includes(path.node.source.value)) {
          path.node.source.value = 'effector-logger';
        }
      }
    },
  };

  const instance = effectorPlugin(babel, { addLoc: true, addNames: true, ...effector });

  return {
    name: 'effector-logger/babel-plugin',
    visitor: {
      Program: {
        enter(path, state) {
          if (inspector) addInspector(t, path);

          path.traverse(importVisitor, state);

          if (!skipEffectorPlugin) {
            instance.pre();
            path.traverse(instance.visitor, {
              ...state,
              ...instance,
            });
            instance.post();
          }
        },
      },
    },
  };
};

function addInspector(t, programPath) {
  programPath.unshiftContainer(
    'body',
    t.importDeclaration([], t.stringLiteral('effector-logger/inspector')),
  );
}
