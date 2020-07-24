/**
 * This is an another entry point for webpack.
 * Be careful with BREAKING CHANGES in this file.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import { Domain, Store } from 'effector';
import * as inspector from 'effector-inspector';

import { createName, getPath } from './lib';
import * as logger from './logger';
import * as devtools from './redux-devtools';

export { LOGGER_DOMAIN_NAME } from './lib';

export function attachLogger(domain: Domain): void {
  domain.onCreateEvent((event) => {
    const name = createName(event.compositeName);
    const fileName = getPath(event);

    logger.eventAdded(event);
    inspector.addEvent(event);

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
    inspector.addStore(store);

    const storeMap = store.map.bind(store);

    store.map = (fn: any, firstState?: any): Store<any> => {
      const mappedStore = storeMap(fn, firstState);

      mappedStore.compositeName.path = store.compositeName.path.slice(0, -1);
      mappedStore.compositeName.path.push(
        store.compositeName.path.slice(-1) + ' -> *',
      );
      inspector.addStore(mappedStore, { mapped: true });
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

    logger.effectAdded(effect);
    devtools.effectAdded(name, effect);
    inspector.addEffect(effect)

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
