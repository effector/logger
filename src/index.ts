import { createDomain as newDomain } from 'effector';
import { applyLog } from './log';

const root = newDomain('@effector-logger');

applyLog(root);

const { createDomain, createStore, createEffect, createEvent } = root;

export * from 'effector';
export { createDomain, createStore, createEffect, createEvent };
