import { test, expect, describe, vi } from 'vitest';

import { createStore, createEvent, createEffect, sample, fork, allSettled } from 'effector';

import { attachLogger, configure } from '../dist';

describe('logger tests', () => {
  test('logger works', () => {
    const $abc = createStore(0);
    const inc = createEvent();
    $abc.on(inc, (state) => state + 1);
    const myFx = createEffect(() => 42);
    sample({
      clock: inc,
      target: myFx,
    });

    const logged = vi.fn();

    vi.stubGlobal('console', {
      log: logged,
      warn: logged,
      error: logged,
      info: logged,
      group: logged,
      groupEnd: logged,
      groupCollapsed: logged,
    });

    const unlogger = attachLogger();

    inc();

    const logs = logged.mock.calls;
    expect(logs).toMatchInlineSnapshot(`
      [
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #9ccc65; color: #000",
          "4",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding-left: 4px;",
          undefined,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "4",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
          "2",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          1,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "2",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #26a69a; color: #000",
          "5",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding-left: 4px;",
          undefined,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "5",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
          "5.inFlight",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          1,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "5.inFlight",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c(%o)  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #26a69a; color: #000",
          "5",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "done ✅",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding-left: 4px;",
          undefined,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding: 0;",
          42,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "5",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
          "5.inFlight",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          0,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "5.inFlight",
        ],
      ]
    `);
    unlogger();

    inc();

    const nextLogs = logged.mock.calls;

    expect(logs).toStrictEqual(nextLogs);
  });

  test('logger works (scope)', () => {
    const $abc = createStore(0);
    const inc = createEvent();
    $abc.on(inc, (state) => state + 1);
    const myFx = createEffect(() => 42);
    sample({
      clock: inc,
      target: myFx,
    });

    const logged = vi.fn();

    vi.stubGlobal('console', {
      log: logged,
      warn: logged,
      error: logged,
      info: logged,
      group: logged,
      groupEnd: logged,
      groupCollapsed: logged,
    });

    const scope = fork();

    const unlogger = attachLogger({
      scope,
    });

    allSettled(inc, { scope });

    const logs = logged.mock.calls;
    expect(logs).toMatchInlineSnapshot(`
      [
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #9ccc65; color: #000",
          "(scope: 67) 21",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding-left: 4px;",
          undefined,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "(scope: 67) 21",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
          "(scope: 67) 19",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          1,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "(scope: 67) 19",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #26a69a; color: #000",
          "(scope: 67) 22",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding-left: 4px;",
          undefined,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "(scope: 67) 22",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
          "(scope: 67) 22.inFlight",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          1,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "(scope: 67) 22.inFlight",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c(%o)  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #26a69a; color: #000",
          "(scope: 67) 22",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "done ✅",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding-left: 4px;",
          undefined,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; padding: 0;",
          42,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "(scope: 67) 22",
        ],
        [
          "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "☄️",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "effector",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
          "(scope: 67) 22.inFlight",
          "color: currentColor; background-color: transparent;",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          "-> ",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
          0,
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "",
          "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
          "(scope: 67) 22.inFlight",
        ],
      ]
    `);
    unlogger();

    allSettled(inc, { scope });

    const nextLogs = logged.mock.calls;

    expect(logs).toStrictEqual(nextLogs);
  });

  describe('configure', () => {
    test('configure can supress logs', () => {
      const $abc = createStore(0);
      const inc = createEvent();
      $abc.on(inc, (state) => state + 1);
      const myFx = createEffect(() => 42);
      sample({
        clock: inc,
        target: myFx,
      });

      const logged = vi.fn();

      vi.stubGlobal('console', {
        log: logged,
        warn: logged,
        error: logged,
        info: logged,
        group: logged,
        groupEnd: logged,
        groupCollapsed: logged,
      });

      configure($abc, { log: 'disabled' });
      configure([inc, myFx], { log: 'disabled' });

      const unlogger = attachLogger();

      inc();

      expect(logged.mock.calls.length).toBe(2); // initial logs of logger installation
      expect(logged.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "☄️",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "effector",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
            "39.inFlight",
            "color: currentColor; background-color: transparent;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            "-> ",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            1,
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "39.inFlight",
          ],
          [
            "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "☄️",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "effector",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
            "39.inFlight",
            "color: currentColor; background-color: transparent;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            "-> ",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            0,
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "39.inFlight",
          ],
        ]
      `);

      unlogger();
    });

    test('configure can force logs', () => {
      const $abc = createStore(0);
      const inc = createEvent();
      $abc.on(inc, (state) => state + 1);
      const myFx = createEffect(() => 42);
      sample({
        clock: inc,
        target: myFx,
      });

      const derivedInc = inc.map((x) => 'LOGGED!!!!');

      const logged = vi.fn();

      vi.stubGlobal('console', {
        log: logged,
        warn: logged,
        error: logged,
        info: logged,
        group: logged,
        groupEnd: logged,
        groupCollapsed: logged,
      });

      configure($abc, { log: 'disabled' });
      configure([inc, myFx], { log: 'disabled' });

      // force logs of derived unit
      configure(derivedInc, { log: 'enabled' });

      const unlogger = attachLogger();

      inc();

      expect(logged.mock.calls.length).toBe(3); // initial logs of logger installation + single update of derivedInc
      expect(logged.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "%c%s%c  %c%s%c  %c%s%c  %c%o  %c%s  %c%s",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "☄️",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "effector",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #9ccc65; color: #000",
            "55 → *",
            "color: currentColor; background-color: transparent;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; padding-left: 4px;",
            "LOGGED!!!!",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "55 → *",
          ],
          [
            "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "☄️",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "effector",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
            "56.inFlight",
            "color: currentColor; background-color: transparent;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            "-> ",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            1,
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "56.inFlight",
          ],
          [
            "%c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "☄️",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; line-height:1.5; color: #000; font-family: \\"Apple Emoji Font\\"; font-weight: normal !important;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "effector",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; font-family: Menlo, monospace;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; background-color: #7e57c2; color: #fff",
            "56.inFlight",
            "color: currentColor; background-color: transparent;",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            "-> ",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; ",
            0,
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "",
            "padding-left: 4px; padding-right: 4px; font-weight: normal; color: #9e9e9e; padding-left: 20px;",
            "56.inFlight",
          ],
        ]
      `);

      unlogger();
    });
  });
});
