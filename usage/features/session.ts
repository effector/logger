import { createStore } from '../../src';
import { sessionFetch } from '../api/session';

export const $session = createStore<null | { id: number }>(null);

$session.on(sessionFetch.done, (_, { result }) => result);
