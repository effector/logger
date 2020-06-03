import { createStore } from '../../src';
import { sessionFetch } from '../api/session';

export const $session = createStore<null | { id: number }>(null);

$session.on(sessionFetch.doneData, result => result);
