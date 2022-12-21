import * as effector from 'effector';
import set from 'set-value';
import { createName } from './lib';

/* eslint-disable @typescript-eslint/ban-ts-ignore, @typescript-eslint/no-explicit-any */
const reduxDevTools =
  // @ts-ignore
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;

function instanceId(): string {
  if (typeof document === 'object') {
    return `☄️ ${document.title}`;
  }
  return '☄️ no title instance';
}

const devToolConfig = {
  instanceId: instanceId(),
} as unknown as { swallowErrors?: boolean };

const rootState: Record<string, any> = {};

function setState(name: string, value: any): void {
  set(rootState, name.replace(/\//g, '.'), value);
}

export function eventCalled(name: string, payload: any): void {
  if (reduxDevTools) {
    reduxDevTools.send(
      {
        type: `${name} (event)`,
        payload,
      },
      rootState,
      devToolConfig,
    );
  }
}

export function storeAdded(store: effector.Store<any>): void {
  const name = createName(store.compositeName);

  setState(name, store.defaultState);
}

export function storeUpdated(name: string, value: any): void {
  setState(name, value);

  if (reduxDevTools && reduxDevTools.send) {
    reduxDevTools.send(
      {
        type: `${name} (store updated)`,
        value,
      },
      rootState,
      devToolConfig,
    );
  }
}

type Effect = effector.Effect<any, any, any>;

function effectUpdateState(name: string, effect: Effect): void {
  setState(name, {
    inFlight: effect.inFlight.getState(),
    pending: effect.pending.getState(),
  });
}

export function effectAdded(name: string, effect: Effect): void {
  effectUpdateState(name, effect);
}

export function effectCalled(name: string, effect: Effect, parameters: any): void {
  effectUpdateState(name, effect);

  if (reduxDevTools) {
    reduxDevTools.send(
      { type: `${name} (effect called)`, params: parameters },
      rootState,
      devToolConfig,
    );
  }
}

export function effectDone(name: string, effect: Effect, parameters: any, result: any): void {
  effectUpdateState(name, effect);

  if (reduxDevTools) {
    reduxDevTools.send(
      { type: `${name}.done (effect finished)`, params: parameters, result },
      rootState,
      devToolConfig,
    );
  }
}

export function effectFail(name: string, effect: Effect, parameters: any, error: any): void {
  effectUpdateState(name, effect);

  if (reduxDevTools) {
    reduxDevTools.send(
      { type: `${name}.fail (effect finished)`, params: parameters, error },
      rootState,
      devToolConfig,
    );
  }
}
