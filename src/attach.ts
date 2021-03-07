/**
 * This is an another entry point for webpack.
 * Be careful with BREAKING CHANGES in this file.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import { Domain, is, Scope, Store } from 'effector';
import * as inspector from 'effector-inspector';

import { createName, getPath, watch } from './lib';
import * as consoleLogger from './logger';
import * as devtools from './redux-devtools';

export { LOGGER_DOMAIN_NAME } from './lib';

type Options = {
  reduxDevtools: 'enabled' | 'disabled';
  console: 'enabled' | 'disabled';
  inspector: 'enabled' | 'disabled';
};

const defaults: Options = {
  reduxDevtools: 'enabled',
  console: 'enabled',
  inspector: 'enabled',
};

export function attachLogger(
  source: Domain | Scope,
  logTo: Partial<Options> = {},
): void {
  const options = { ...defaults, ...logTo };
  const isConsole = options.console === 'enabled';
  const isRedux = options.reduxDevtools === 'enabled';
  const isInspector = options.inspector === 'enabled';

  function attachEvent(event: any): void {
    const name = createName(event.compositeName);
    const fileName = getPath(event);

    if (isConsole) consoleLogger.eventAdded(event);
    if (isInspector) inspector.addEvent(event);

    watch(event, source, (payload) => {
      if (isConsole) consoleLogger.eventCalled(name, fileName, payload);
      if (isRedux) devtools.eventCalled(name, payload);
    });
  }

  function attachStore(store: any): void {
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

    watch(store, source, (value) => {
      if (isConsole) consoleLogger.storeUpdated(name, fileName, value);
      if (isRedux) devtools.storeUpdated(name, value);
    });
  }

  function attachEffect(effect: any): void {
    const name = createName(effect.compositeName);
    const fileName = getPath(effect);

    if (isConsole) consoleLogger.effectAdded(effect);
    if (isRedux) devtools.effectAdded(name, effect);
    if (isInspector) inspector.addEffect(effect);

    watch(effect, source, (parameters) => {
      if (isConsole) consoleLogger.effectCalled(name, fileName, parameters);
      if (isRedux) devtools.effectCalled(name, effect, parameters);
    });

    watch(effect.done, source, ({ params, result }) => {
      if (isConsole) consoleLogger.effectDone(name, fileName, params, result);
      if (isRedux) devtools.effectDone(name, effect, params, result);
    });

    watch(effect.fail, source, ({ params, error }) => {
      if (isConsole) consoleLogger.effectFail(name, fileName, params, error);
      if (isRedux) devtools.effectFail(name, effect, params, error);
    });
  }

  if (is.domain(source)) {
    source.onCreateEvent(attachEvent);
    source.onCreateStore(attachStore);
    source.onCreateEffect(attachEffect);
  } else {
    const root = (source as any).cloneOf;
    for (const event of root.history.events) {
      attachEvent(event);
    }
    for (const effect of root.history.effects) {
      attachEffect(effect);
    }
    for (const store of root.history.stores) {
      attachStore(store);
    }
  }
}
