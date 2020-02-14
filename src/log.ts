import { Domain, CompositeName } from 'effector';
import * as inspector from './inspector';
import * as devtools from './redux-devtools';

function createName(composite: CompositeName): string {
  return composite.path.slice(1).join('/');
}

export function applyLog(domain: Domain) {
  domain.onCreateEvent((event) => {
    const name = createName(event.compositeName);
    const fileName = (event as any).defaultConfig?.loc?.file ?? ' ';
    inspector.addEvent(event);

    event.watch((payload) => {
      console.log(
        '[effector-logger] %cEVENT%c %s PAYLOAD(%O) %c%s',
        'color: magenta;',
        'color: currentColor;',
        name,
        payload,
        'color: gray;',
        fileName,
      );
      devtools.log('EVENT', name, payload);
    });
  });

  domain.onCreateStore((store) => {
    const name = createName(store.compositeName);
    const fileName = (store as any).defaultConfig?.loc?.file ?? ' ';
    inspector.addStore(store);

    devtools.updateStore(name, store.defaultState);

    store.updates.watch((value) => {
      console.log(
        '[effector-logger] %cSTORE%c %s VALUE(%o) %c%s',
        'color: deepskyblue;',
        'color: currentColor;',
        name,
        value,
        'color: gray',
        fileName,
      );
      devtools.log('STORE', name, value);
    });
  });

  domain.onCreateEffect((effect) => {
    const name = createName(effect.compositeName);
    const fileName = (effect as any).defaultConfig?.loc?.file ?? ' ';

    effect.watch((parameters) => {
      console.log(
        '[effector-logger] %cEFFECT%c %s PARAMS(%o) %c%s',
        'color: orange;',
        'color: currentColor;',
        name,
        parameters,
        'color: gray',
        fileName,
      );
      devtools.log('EFFECT', name, parameters);
    });

    effect.done.watch(({ params, result }) => {
      console.log(
        '[effector-logger] %cEFFECT DONE%c %s PARAMS(%o) -> %o %c%s',
        'color: green;',
        'color: currentColor;',
        name,
        params,
        result,
        'color: gray',
        fileName,
      );
      devtools.log('EFFECT DONE', name, params, result);
    });

    effect.fail.watch(({ params, error }) => {
      console.log(
        '[effector-logger] %cEFFECT FAIL%c %s PARAMS(%o) -> %o %c%s',
        'color: red;',
        'color: currentColor;',
        name,
        params,
        error,
        'color: gray',
        fileName,
      );
      devtools.log('EFFECT FAIL', name, params, error);
    });
  });

  domain.onCreateDomain(applyLog);
}
