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

export function addEvent(event: Event<any>): void {
  inspector?.addEvent(event);
}
export function addStore(store: Store<any>): void {
  inspector?.addStore(store);
}
