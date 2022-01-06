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
const reduxDevToolsSend = jest.spyOn(window.__REDUX_DEVTOOLS_EXTENSION__, 'send');

test('console logger is initialized', async () => {
  expect($counter.sid).toMatchInlineSnapshot(`"fcubtv"`);
  expect(thingHappened.sid).toMatchInlineSnapshot(`"-v2bq3u"`);
  await new Promise((r) => setTimeout(r));
  expect(log.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
        "☄️",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
        "effector",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #29b6f6; color: #000",
        "new",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #29b6f6; color: #000",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
        "$counter",
        "color: currentColor; background-color: transparent;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        "-> ",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        0,
        "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
        "/src/model.ts",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        "$counter",
      ],
      Array [
        "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%s",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
        "☄️",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
        "effector",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #29b6f6; color: #000",
        "new",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #29b6f6; color: #000",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #9ccc65; color: #000",
        "thingHappened",
        "color: currentColor; background-color: transparent;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
        "/src/model.ts",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        "thingHappened",
      ],
    ]
  `);
  expect(group.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%s  %c%s  %c%s",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
        "☄️",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
        "effector",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #29b6f6; color: #000",
        "new",
        "color: currentColor; background-color: transparent;",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        "Initialized",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        "events(1)",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        "effects(0)",
        "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
        "stores(1)",
      ],
    ]
  `);
});

test('redux-devtools initialized', async () => {
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

test('inspector initialized', async () => {
  await new Promise((r) => setTimeout(r));

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
  expect(document.querySelector('.effector-inspector')).toBeTruthy()
});
