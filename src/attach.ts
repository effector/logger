/**
 * This is an another entry point for webpack.
 * Be careful with BREAKING CHANGES in this file.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import { Domain, is, Scope, Store, Event, Effect } from 'effector';
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

interface ConfigureOptions {
  log: 'enabled' | 'disabled';
}

interface UnitLogger {
  'effector-logger': ConfigureOptions;
}

const defaultConfigure = (): ConfigureOptions => ({ log: 'enabled' });

type Unit = Store<any> | Event<any> | Effect<any, any, any>;

function withConfig(unit: Unit, partial?: Partial<ConfigureOptions>): typeof unit & UnitLogger {
  const source = unit as unknown as UnitLogger & typeof unit;
  if (!source['effector-logger']) {
    source['effector-logger'] = defaultConfigure();
  }

  if (partial) {
    source['effector-logger'] = {
      ...source['effector-logger'],
      ...partial,
    };
  }
  return source;
}

export function configure(unit: Array<Unit> | Unit, config?: Partial<ConfigureOptions>): void {
  if (Array.isArray(unit)) {
    unit.forEach((unit) => withConfig(unit, config));
    return;
  }
  withConfig(unit, config);
}

function shouldLog(unit: Event<any> | Store<any> | Effect<any, any>): boolean {
  return withConfig(unit)['effector-logger'].log === 'enabled';
}

export function attachLogger(source: Domain | Scope, logTo: Partial<Options> = {}): void {
  const options = { ...defaults, ...logTo };
  const isConsole = options.console === 'enabled';
  const isRedux = options.reduxDevtools === 'enabled';
  const isInspector = options.inspector === 'enabled';

  function attachEvent(event: Event<any>): void {
    const name = createName(event.compositeName);
    const fileName = getPath(event);

    if (isConsole) consoleLogger.eventAdded(event);
    if (isInspector) inspector.addEvent(event);

    watch(event, source, (payload) => {
      if (shouldLog(event)) {
        if (isConsole) consoleLogger.eventCalled(name, fileName, payload);
        if (isRedux) devtools.eventCalled(name, payload);
      }
    });
  }

  function attachStore(store: Store<any>): void {
    const name = createName(store.compositeName);
    const fileName = getPath(store);

    if (isConsole) consoleLogger.storeAdded(store);
    if (isRedux) devtools.storeAdded(store);
    if (isInspector) inspector.addStore(store);

    const storeMap = store.map.bind(store);

    store.map = (fn: any, firstState?: any): Store<any> => {
      const mappedStore = storeMap(fn, firstState);

      mappedStore.compositeName.path = store.compositeName.path.slice(0, -1);
      mappedStore.compositeName.path.push(store.compositeName.path.slice(-1) + ' -> *');
      if (isInspector) inspector.addStore(mappedStore, { mapped: true });
      return mappedStore;
    };

    watch(store, source, (value) => {
      if (shouldLog(store)) {
        if (isConsole) consoleLogger.storeUpdated(name, fileName, value);
        if (isRedux) devtools.storeUpdated(name, value);
      }
    });
  }

  function attachEffect(effect: Effect<any, any, any>): void {
    const name = createName(effect.compositeName);
    const fileName = getPath(effect);

    if (isConsole) consoleLogger.effectAdded(effect);
    if (isRedux) devtools.effectAdded(name, effect);
    if (isInspector) inspector.addEffect(effect);

    watch(effect, source, (parameters) => {
      if (shouldLog(effect)) {
        if (isConsole) consoleLogger.effectCalled(name, fileName, parameters);
        if (isRedux) devtools.effectCalled(name, effect, parameters);
      }
    });

    watch(effect.done, source, ({ params, result }) => {
      if (shouldLog(effect)) {
        if (isConsole) consoleLogger.effectDone(name, fileName, params, result);
        if (isRedux) devtools.effectDone(name, effect, params, result);
      }
    });

    watch(effect.fail, source, ({ params, error }) => {
      if (shouldLog(effect)) {
        if (isConsole) consoleLogger.effectFail(name, fileName, params, error);
        if (isRedux) devtools.effectFail(name, effect, params, error);
      }
    });
  }

  if (is.domain(source)) {
    source.onCreateEvent(attachEvent);
    source.onCreateStore(attachStore);
    source.onCreateEffect(attachEffect);
  } else {
    const root = (source as any).cloneOf;
    if (root === undefined) {
      throw new Error('Scope should be created from domain');
    }
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
