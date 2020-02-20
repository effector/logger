/**
 * This is an another entry point for webpack.
 * Be careful with BREAKING CHANGES in this file.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import { Domain, Store } from 'effector';
import { createName, getPath } from './lib';
export { LOGGER_DOMAIN_NAME } from './lib';

import * as logger from './logger';
import * as inspector from './inspector';
import * as devtools from './redux-devtools';

export function attachLogger(domain: Domain): void {
  domain.onCreateEvent((event) => {
    const name = createName(event.compositeName);
    const fileName = getPath(event);

    inspector.eventAdded(event);

    event.watch((payload) => {
      logger.eventCalled(name, fileName, payload);
      devtools.eventCalled(name, payload);
    });
  });

  domain.onCreateStore((store) => {
    const name = createName(store.compositeName);
    const fileName = getPath(store);

    logger.storeAdded(store);
    devtools.storeAdded(store);
    inspector.storeAdded(store);

    const storeMap = store.map.bind(store);

    store.map = (fn: any, firstState?: any): Store<any> => {
      const mappedStore = storeMap(fn, firstState);

      mappedStore.compositeName.path = store.compositeName.path.slice(0, -1);
      mappedStore.compositeName.path.push(
        store.compositeName.path.slice(-1) + ' -> *',
      );
      inspector.storeAdded(mappedStore);
      return mappedStore;
    };

    store.updates.watch((value) => {
      logger.storeUpdated(name, fileName, value);
      devtools.storeUpdated(name, value);
    });
  });

  domain.onCreateEffect((effect) => {
    const name = createName(effect.compositeName);
    const fileName = getPath(effect);

    devtools.effectAdded(name, effect);

    effect.watch((parameters) => {
      logger.effectCalled(name, fileName, parameters);
      devtools.effectCalled(name, effect, parameters);
    });

    effect.done.watch(({ params, result }) => {
      logger.effectDone(name, fileName, params, result);
      devtools.effectDone(name, effect, params, result);
    });

    effect.fail.watch(({ params, error }) => {
      logger.effectFail(name, fileName, params, error);
      devtools.effectFail(name, effect, params, error);
    });
  });
}
