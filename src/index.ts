export * from 'effector';
import { createDomain as newDomain } from 'effector';
import { createInspector } from './inspector';
import { applyLog } from './log';

const root = newDomain('@effector-logger');

applyLog(root);

const { createDomain, createStore, createEffect, createEvent } = root;

export { createDomain, createStore, createEffect, createEvent };
export { createInspector };
