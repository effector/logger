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

const info = jest.spyOn(console, 'info');
const log = jest.spyOn(console, 'log');
const group = jest.spyOn(console, 'groupCollapsed');
const reduxDevToolsSend = jest.spyOn(globalThis.__REDUX_DEVTOOLS_EXTENSION__, 'send');

test('console logger is initialized', async () => {
  expect($counter.sid).toMatchInlineSnapshot(`"fcubtv"`);
  expect(thingHappened.sid).toMatchInlineSnapshot(`"-v2bq3u"`);
  await new Promise((r) => setTimeout(r));
  expect(log.mock.calls).toMatchInlineSnapshot(`[]`);
  expect(group.mock.calls).toMatchInlineSnapshot(`[]`);
});

test('redux-devtools initialized', async () => {
  thingHappened();

  await new Promise((r) => setTimeout(r));

  expect(reduxDevToolsSend.mock.calls.map((call) => call[0])).toMatchInlineSnapshot(`
    [
      {
        "payload": undefined,
        "type": "thingHappened (event)",
      },
      {
        "type": "$counter (store updated)",
        "value": 1,
      },
    ]
  `);
});

test('inspector initialized', async () => {
  await new Promise((r) => setTimeout(r));

  expect(document.querySelector('.effector-inspector')).toBeTruthy();
  expect(info.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "%c[effector-inspector] %cPress %cCTRL+B %cto open Inspector",
          "color: gray; font-size: 1rem;",
          "color: currentColor; font-size: 1rem;",
          "color: deepskyblue; font-family: monospace; font-size: 1rem;",
          "color: currentColor; font-size: 1rem;",
        ],
      ]
  `);
});
