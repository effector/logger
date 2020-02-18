import { Event, Store, Effect, Domain } from 'effector';

interface Inspector {
  addStore: (
    store: Store<any>,
    opts?: { mapped?: boolean; name?: string },
  ) => void;
}

let inspector: Inspector | null = null;

try {
  inspector = require('effector-inspector');
} catch (_) {
  /** Nothing here */
}

export function eventAdded(event: Event<any>): void {
  /** Nothing here */
}
export function storeAdded(store: Store<any>, mapped = false): void {
  inspector?.addStore(store, { mapped });
}
