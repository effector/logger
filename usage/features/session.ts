import { createStore } from 'effector';
import { sessionFetch } from '../api/session';

export const $session = createStore<null | { id: number }>(null);

$session.on(sessionFetch.doneData, (result) => result);

setTimeout(() => {
  const $asyncLoadedStore = createStore('some string');

  $asyncLoadedStore.on(sessionFetch.doneData, (result) => `${Math.random()}`);
}, 1500);
