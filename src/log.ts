/* eslint-disable @typescript-eslint/ban-ts-ignore */

import { Domain, CompositeName, Store } from 'effector';
import * as inspector from './inspector';

function createName(composite: CompositeName): string {
  return composite.path.slice(1).join('/');
}

function replaceStoreMap(store: Store<any>) {
  const originalMap = store.map; // eslint-disable-line @typescript-eslint/unbound-method
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/unbound-method
  store.map = (...args) => {
    // @ts-ignore
    const newStore = originalMap(...args);
    replaceStoreMap(newStore)

    // inspector.addStore(newStore);
    // @ts-ignore
    newStore.updates.watch((value) => {
      console.log(
        '[effector-logger] %cSTORE%c %s VALUE(%o) %c%s',
        'color: deepskyblue;',
        'color: currentColor;',
        newStore.compositeName.shortName,
        value,
        'color: gray',
      );
    });

    return newStore;
  };
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
    });
  });

  domain.onCreateStore((store) => {
    const name = createName(store.compositeName);
    const fileName = (store as any).defaultConfig?.loc?.file ?? ' ';
    inspector.addStore(store);
    replaceStoreMap(store);
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
    });
  });

  domain.onCreateDomain(applyLog);
}
