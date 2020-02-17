/* eslint-disable @typescript-eslint/no-explicit-any */
import { Domain } from 'effector';
import { createName, getPath } from './lib';

import * as logger from './logger';
import * as inspector from './inspector';
import * as devtools from './redux-devtools';

export function applyLog(domain: Domain): void {
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

    inspector.storeAdded(store);
    logger.storeAdded(store);
    devtools.storeAdded(store);

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

  domain.onCreateDomain(applyLog);
}
