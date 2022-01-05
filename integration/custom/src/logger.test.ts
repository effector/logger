/**
 * @jest-environment jsdom
 */

import { $counter, thingHappened } from './model';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: {
      send: jest.Mock;
    };
  }
}

test('console logger is initialized', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => null);

  expect($counter.sid).toMatchInlineSnapshot(`"evspfo"`);
  expect(thingHappened.sid).toMatchInlineSnapshot(`"-vjdci1"`);
  await new Promise((r) => setTimeout(r));
  expect(log.mock.calls.map((call) => call[0])).toMatchInlineSnapshot(`
    Array [
      "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
      "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%s",
    ]
  `);

  log.mockRestore();
});

test('redux-devtools initialized', async () => {
  const reduxDevToolsSend = jest.spyOn(window.__REDUX_DEVTOOLS_EXTENSION__, 'send');
  thingHappened();

  await new Promise((r) => setTimeout(r));

  expect(reduxDevToolsSend.mock.calls.map((call) => call[0])).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "thingHappened (event)",
      },
      Object {
        "type": "$counter (store updated)",
        "value": 1,
      },
    ]
  `);
});
