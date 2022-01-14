import { createDomain } from 'effector';
import { attachLogger } from 'effector-logger/attach';

const root = createDomain();
attachLogger(root);

export const thingHappened = root.createEvent();
export const $counter = root.createStore(0).on(thingHappened, (s) => s + 1);
