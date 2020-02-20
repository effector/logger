import { createDomain } from '../../src';

const api = createDomain();

export const sessionFetch = api
  .createEffect<number, null | { id: number }>()
  .use((params) => {
    return { id: 100000 + params };
  });
