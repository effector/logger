import { createDomain } from 'effector';
import { attachLogger } from 'effector-logger';

attachLogger();

const root = createDomain();

export const thingHappened = root.createEvent();
export const $counter = root.createStore(0).on(thingHappened, (s) => s + 1);
