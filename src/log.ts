/* eslint-disable @typescript-eslint/no-explicit-any */
import { Domain, CompositeName, Store, Unit } from 'effector';
import debounce from 'just-debounce-it';
import * as inspector from './inspector';
import * as devtools from './redux-devtools';

function createName(composite: CompositeName): string {
  return composite.path.slice(1).join('/');
}

function getPath(unit: Unit<any>): string {
  return (unit as any).defaultConfig?.loc?.file ?? ' ';
}

const storeListToInit: Array<Store<any>> = [];

const logStore = debounce(() => {
  const list = storeListToInit.splice(0);
  if (list.length > 0) {
    console.groupCollapsed(
      `[effector-logger] Initialized stores (${list.length})`,
    );
    for (const store of list) {
      const name = createName(store.compositeName);
      const fileName = getPath(store);

      console.log(
        '[effector-logger] %cSTORE%c %s VALUE(%o) %c%s',
        'color: deepskyblue;',
        'color: currentColor;',
        name,
        store.defaultState,
        'color: gray',
        fileName,
      );
    }
    console.groupEnd();
  }
}, 5);

function addStore(store: Store<any>): void {
  storeListToInit.push(store);
  logStore();
}

export function applyLog(domain: Domain): void {
  domain.onCreateEvent((event) => {
    const name = createName(event.compositeName);
    const fileName = getPath(event);

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
    const fileName = getPath(store);

    inspector.addStore(store);
    devtools.updateStore(name, store.defaultState);
    addStore(store);

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
    const fileName = getPath(effect);

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
