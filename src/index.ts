import * as effector from 'effector';
import { attachLogger, configure } from './attach';
import { LOGGER_DOMAIN_NAME } from './lib';

const root = effector.createDomain(LOGGER_DOMAIN_NAME);

attachLogger(root);

const { createDomain, createStore, createEffect, createEvent } = root;

export { createDomain, createStore, createEffect, createEvent, configure };
export * from 'effector';
