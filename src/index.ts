import { createDomain as newDomain } from 'effector';
import { attachLogger } from './attach';
import { LOGGER_DOMAIN_NAME } from './lib';

const root = newDomain(LOGGER_DOMAIN_NAME);

attachLogger(root);

const { createDomain, createStore, createEffect, createEvent } = root;

export * from 'effector';
export { createDomain, createStore, createEffect, createEvent };
