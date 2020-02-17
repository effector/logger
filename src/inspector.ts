import { Event, Store, Effect, Domain } from 'effector';

interface Inspector {
  addEvent: Event<Event<any>>;
  addStore: Event<Store<any>>;
}

let inspector: Inspector | null = null;

try {
  inspector = require('effector-inspector');
} catch (_) {
  /** Nothing here */
}

export function eventAdded(event: Event<any>): void {
  inspector?.addEvent(event);
}
export function storeAdded(store: Store<any>): void {
  inspector?.addStore(store);
}
