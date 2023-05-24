/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { inspect, Message, inspectGraph } from 'effector/inspect';
import type { Scope, Unit } from 'effector';
import { is } from 'effector';

import {
  storeUpdated,
  eventCalled,
  effectCalled,
  effectDone,
  effectFail,
  createDeclarationsLogger,
} from './logger';
import { getNode, getName, locToString } from './lib';

const ignored = new Set<string>();
const forceLog = new Set<string>();
const fxRunning = new Map<string, string>();
let mode = 'blacklist'; // default mode is blacklist

export function attachLogger(config: { scope?: Scope; name?: string, mode?: 'blacklist' | 'whitelist' } = {}): () => void {
  const name = config.name || (config.scope ? `scope: ${getNode(config.scope).id}` : '');
  mode = config.mode || 'blacklist';

  const logDeclarations = createDeclarationsLogger({
    name,
    scope: config.scope,
  });

  const uninspect = inspect({
    scope: config.scope || undefined,
    fn: (m) => {
      const shouldLogBlacklist = isLoggable(m) && !ignored.has(m.id);
      const shouldLogWhitelist = forceLog.has(m.id);
      
      const shouldLog = mode === 'blacklist' ? shouldLogBlacklist : shouldLogWhitelist;

      if (shouldLog) {
        log(m, name);
      }
    },
  });

  logDeclarations();

  const uninspectGraph = inspectGraph({
    fn: () => {
      logDeclarations();
    },
  });

  return () => {
    uninspect();
    uninspectGraph();
  };
}

export function configure(
  unitOrUnits: Unit<any> | Unit<any>[],
  config: { log: 'disabled' | 'enabled' },
): void {
  const units = Array.isArray(unitOrUnits) ? unitOrUnits : [unitOrUnits];

  if (config.log === 'disabled' && mode === 'blacklist') {
    units.forEach((unit) => {
      ignored.add(getNode(unit).id);

      if (is.effect(unit)) {
        ignored.add(getNode(unit.finally).id);
      }
    });
  }
  if (config.log === 'enabled' && mode === 'whitelist') {
    units.forEach((unit) => {
      forceLog.add(getNode(unit).id);

      if (is.effect(unit)) {
        forceLog.add(getNode(unit.finally).id);
      }
    });
  }
}

// utils
function isLoggable(m: Message) {
  return isEffectFinally(m) || (!m.meta.derived && m.type === 'update');
}
function isEffectFinally(m: Message) {
  return m.kind === 'event' && m.meta.named === 'finally';
}
function log(m: Message, name: string) {
  if (m.kind === 'effect') {
    const fxName = getName(m, name);

    effectCalled(fxName, locToString(m.loc) || '', m.value);
    fxRunning.set((m.stack as any).fxID, fxName);

    return;
  }
  if (isEffectFinally(m)) {
    const fxName = fxRunning.get((m.stack as any).fxID);
    if (fxName) {
      fxRunning.delete((m.stack as any).fxID);

      const finallyValue = m.value as {
        status: 'fail' | 'done';
        params: any;
        result: any;
        error: any;
      };

      if (finallyValue.status === 'fail') {
        effectFail(fxName, locToString(m.loc) || '', finallyValue.params, finallyValue.error);
      }
      if (finallyValue.status === 'done') {
        effectDone(fxName, locToString(m.loc) || '', finallyValue.params, finallyValue.result);
      }
    }

    return;
  }
  if (m.kind === 'store') {
    storeUpdated(getName(m, name), locToString(m.loc) || '', m.value);

    return;
  }
  if (m.kind === 'event') {
    eventCalled(getName(m, name), locToString(m.loc) || '', m.value);

    return;
  }
}
