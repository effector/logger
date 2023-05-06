import { createStore, createEvent } from 'effector';
import { attachLogger } from 'effector-logger';

attachLogger();

export const thingHappened = createEvent();
export const $counter = createStore(0).on(thingHappened, (s) => s + 1);
