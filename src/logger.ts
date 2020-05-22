/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'just-debounce-it';
import isNode from 'detect-node';
import { Effect, Event, Store } from 'effector';
import { createName, getPath } from './lib';

const SEPARATOR = isNode ? '  ' : '';

const storeListToInit: Array<Store<any>> = [];
const eventListToInit: Array<Event<any>> = [];
const effectListToInit: Array<Effect<any, any, any>> = [];

const styles = {
  block: 'padding-left: 4px; padding-right: 4px; font-weight: normal;',
  chunk: 'padding-left: 4px; padding-right: 4px; font-weight: normal;',
  effector:
    'line-height:1.5; color: #000; font-family: "Apple Emoji Font"; font-weight: normal !important;',
  new: 'background-color: #29b6f6; color: #000',
  store: 'background-color: #7e57c2; color: #fff',
  event: 'background-color: #9ccc65; color: #000',
  effect: 'background-color: #26a69a; color: #000',
  emoji: '',
  file: 'color: #9e9e9e; padding-left: 20px;',
  reset: 'color: currentColor; background-color: transparent;',
};

const effectorLabel: Block[] = [
  ['☄️', '%s', styles.effector],
  ['effector', '%s', 'font-family: Menlo, monospace;']
];

const reset = (index: number, count: number, style: string): string =>
  index === count - 1 ? styles.reset : style;

type Block = [string, string, string];
type Chunk = [any, string, string];

function log(
  blocks: Block[],
  chunks: Chunk[],
  group: 'collapsed' | 'open' | void = undefined,
): void {
  const str: string[] = [];
  const params: any[] = [];

  blocks.unshift(...effectorLabel);

  blocks.forEach(([value, view, style], index) => {
    str.push(`%c${view}%c`);
    params.push(
      `${styles.block} ${style}`,
      value,
      reset(index, blocks.length, `${styles.block} ${style}`),
    );
  });

  chunks.forEach(([value, view, style]) => {
    str.push(`%c${view}`);
    params.push(`${styles.chunk} ${style}`, value);
  });

  const args = [str.join(SEPARATOR), ...params];

  if (group === 'open') {
    console.group(...args);
  } else if (group === 'collapsed') {
    console.groupCollapsed(...args);
  } else {
    console.log(...args);
  }
}

const blockStore: Block = ['store', '%s', styles.store];
const blockNew: Block = ['new', '%s', styles.new];
const blockEvent: Block = ['event', '%s', styles.event];
const blockEffect: Block = ['effect', '%s', styles.effect];

const logAdded = debounce(() => {
  const stores = storeListToInit.splice(0);
  const events = eventListToInit.splice(0);
  const effects = effectListToInit.splice(0);

  if (stores.length + events.length + effects.length > 0) {
    log(
      [blockNew],
      [
        ['Initialized', '%s', ''],
        [`events(${events.length})`, '%s', ''],
        [`effects(${effects.length})`, '%s', ''],
        [`stores(${stores.length})`, '%s', ''],
      ],
      'collapsed',
    );

    if (stores.length) {
      stores.forEach((store) => {
        const name = createName(store.compositeName);
        const fileName = getPath(store);

        log(
          [blockNew, blockStore],
          [
            [name, '%s', ''],
            ['-> ', '%s', ''],
            [store.getState(), '%o', ''],
            [fileName, '%s', styles.file],
          ],
        );
      });
    }
    if (events.length > 0) {
      events.forEach((event) => {
        const name = createName(event.compositeName);
        const fileName = getPath(event);

        log(
          [blockNew, blockEvent],
          [
            [name, '%s', ''],
            [fileName, '%s', styles.file],
          ],
        );
      });
    }
    if (effects.length > 0) {
      effects.forEach((effect) => {
        const name = createName(effect.compositeName);
        const fileName = getPath(effect);

        log(
          [blockNew, blockEffect],
          [
            [name, '%s', ''],
            [fileName, '%s', styles.file],
          ],
        );
      });
    }
    console.groupEnd();
  }
}, 5);

export function storeAdded(store: Store<any>): void {
  storeListToInit.push(store);
  logAdded();
}

export function eventAdded(event: Event<any>): void {
  eventListToInit.push(event);
  logAdded();
}

export function effectAdded(effect: Effect<any, any, any>): void {
  effectListToInit.push(effect);
  logAdded();
}

export function storeUpdated(name: string, fileName: string, value: any): void {
  log(
    [blockStore],
    [
      [name, '%s', ''],
      ['-> ', '%s', ''],
      [value, '%o', ''],
      [fileName, '%s', styles.file],
    ],
  );
}

export function eventCalled(
  name: string,
  fileName: string,
  payload: any,
): void {
  log(
    [blockEvent],
    [
      [name, '%s', 'padding-left: 4px;'],
      [payload, '(%o)', 'padding: 0;'],
      [fileName, '%s', styles.file],
    ],
  );
}

export function effectCalled(
  name: string,
  fileName: string,
  parameters: any,
): void {
  log(
    [blockEffect],
    [
      [name, '%s', 'padding-left: 4px;'],
      [parameters, '(%o)', 'padding: 0;'],
      [fileName, '%s', styles.file],
    ],
  );
}

export function effectDone(
  name: string,
  fileName: string,
  parameters: any,
  result: any,
): void {
  log(
    [blockEffect],
    [
      ['done ✅', '%s', styles.emoji],
      [name, '%s', 'padding-left: 4px;'],
      [parameters, '(%o)', 'padding: 0;'],
      ['-> ', '%s', ''],
      [result, '%o', 'padding: 0;'],
      [fileName, '%s', styles.file],
    ],
  );
}

export function effectFail(
  name: string,
  fileName: string,
  parameters: any,
  error: any,
): void {
  const instanceofError = error instanceof Error;

  log(
    [blockEffect],
    [
      ['fail ❌', '%s', styles.emoji],
      [name, '%s', 'padding-left: 4px;'],
      [parameters, '(%o)', 'padding: 0;'],
      ['-> ', '%s', ''],
      instanceofError
        ? [String(error), '%s', '']
        : [error, '%o', 'padding: 0;'],
      [fileName, '%s', styles.file],
    ],
    instanceofError ? 'collapsed' : undefined,
  );

  if (instanceofError) {
    log(
      [],
      [
        [' ', '%s', ''],
        [error, '%o', 'padding-left: 20px;'],
      ],
    );
  }

  console.groupEnd();
}
