/**
 * This is an another entry point for webpack.
 * Be careful with BREAKING CHANGES in this file.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import { Domain, Store } from 'effector';
import * as inspector from 'effector-inspector';

import { createName, getPath } from './lib';
import * as consoleLogger from './logger';
import * as devtools from './redux-devtools';

export { LOGGER_DOMAIN_NAME } from './lib';

type Options = {
  reduxDevtools: 'enabled' | 'disabled';
  console: 'enabled' | 'disabled';
  inspector: 'enabled' | 'disabled';
}

const defaults: Options = {
  reduxDevtools: 'enabled',
  console: 'enabled',
  inspector: 'enabled',
}

export function attachLogger(domain: Domain, logTo: Partial<Options> = {}): void {
  const options = { ...defaults, ...logTo }
  const isConsole = options.console === 'enabled'
  const isRedux = options.reduxDevtools === 'enabled'
  const isInspector = options.inspector === 'enabled'

  domain.onCreateEvent((event) => {
    const name = createName(event.compositeName);
    const fileName = getPath(event);

    if (isConsole) consoleLogger.eventAdded(event);
    if (isInspector) inspector.addEvent(event);

    event.watch((payload) => {
      if (isConsole) consoleLogger.eventCalled(name, fileName, payload);
      if (isRedux) devtools.eventCalled(name, payload);
    });
  });

  domain.onCreateStore((store) => {
    const name = createName(store.compositeName);
    const fileName = getPath(store);

    if (isConsole) consoleLogger.storeAdded(store);
    if (isRedux) devtools.storeAdded(store);
    if (isInspector) inspector.addStore(store);

    const storeMap = store.map.bind(store);

    store.map = (fn: any, firstState?: any): Store<any> => {
      const mappedStore = storeMap(fn, firstState);

      mappedStore.compositeName.path = store.compositeName.path.slice(0, -1);
      mappedStore.compositeName.path.push(
        store.compositeName.path.slice(-1) + ' -> *',
      );
      if (isInspector) inspector.addStore(mappedStore, { mapped: true });
      return mappedStore;
    };

    store.updates.watch((value) => {
      if (isConsole) consoleLogger.storeUpdated(name, fileName, value);
      if (isRedux) devtools.storeUpdated(name, value);
    });
  });

  domain.onCreateEffect((effect) => {
    const name = createName(effect.compositeName);
    const fileName = getPath(effect);

    if (isConsole) consoleLogger.effectAdded(effect);
    if (isRedux) devtools.effectAdded(name, effect);
    if (isInspector) inspector.addEffect(effect)

    effect.watch((parameters) => {
      if (isConsole) consoleLogger.effectCalled(name, fileName, parameters);
      if (isRedux) devtools.effectCalled(name, effect, parameters);
    });

    effect.done.watch(({ params, result }) => {
      if (isConsole) consoleLogger.effectDone(name, fileName, params, result);
      if (isRedux) devtools.effectDone(name, effect, params, result);
    });

    effect.fail.watch(({ params, error }) => {
      if (isConsole) consoleLogger.effectFail(name, fileName, params, error);
      if (isRedux) devtools.effectFail(name, effect, params, error);
    });
  });
}
