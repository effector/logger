/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'just-debounce-it';
import isNode from 'detect-node';
import { inspectGraph, Declaration } from 'effector/inspect';
import { Scope } from 'effector';

import { getName, locToString, getStateFromDeclaration } from './lib';

const SEPARATOR = isNode ? '  ' : '';

const storeListToInit: Array<Declaration> = [];
const eventListToInit: Array<Declaration> = [];
const effectListToInit: Array<Declaration> = [];

inspectGraph({
  fn: (d) => {
    if (!d.derived) {
      if (d.kind === 'store' && !d.meta.named) {
        storeListToInit.push(d);
      }
      if (d.kind === 'event' && !d.meta.named) {
        eventListToInit.push(d);
      }
      if (d.kind === 'effect' && !d.meta.named) {
        effectListToInit.push(d);
      }
    }
  },
});

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
  ['effector', '%s', 'font-family: Menlo, monospace;'],
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

const blockNew: Block = ['new', '%s', styles.new];

const stripDomain = (name: string) => name.split('/').pop() || name;

const createBlockStore: (name: string) => Block = (name) => [stripDomain(name), '%s', styles.store];
const createBlockEvent: (name: string) => Block = (name) => [stripDomain(name), '%s', styles.event];
const createBlockEffect: (name: string) => Block = (name) => [
  stripDomain(name),
  '%s',
  styles.effect,
];

export const createDeclarationsLogger = (config: { name: string; scope?: Scope }) =>
  debounce(() => {
    const stores = storeListToInit.splice(0, storeListToInit.length);
    const events = eventListToInit.splice(0, eventListToInit.length);
    const effects = effectListToInit.splice(0, effectListToInit.length);

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
          const name = getName(store, config.name);
          const fileName = locToString(store.loc);

          log(
            [blockNew, createBlockStore(name)],
            [
              ['-> ', '%s', ''],
              [getStateFromDeclaration(store, config.scope), '%o', ''],
              [fileName, '%s', styles.file],
              [name, '%s', ''],
            ],
          );
        });
      }
      if (events.length > 0) {
        events.forEach((event) => {
          const name = getName(event, config.name);
          const fileName = locToString(event.loc);

          log(
            [blockNew, createBlockEvent(name)],
            [
              [fileName, '%s', styles.file],
              [name, '%s', ''],
            ],
          );
        });
      }
      if (effects.length > 0) {
        effects.forEach((effect) => {
          const name = getName(effect, config.name);
          const fileName = locToString(effect.loc);

          log(
            [blockNew, createBlockEffect(name)],
            [
              [fileName, '%s', styles.file],
              [name, '%s', ''],
            ],
          );
        });
      }
      console.groupEnd();
    }
  }, 5);

export function storeUpdated(name: string, fileName: string, value: any): void {
  log(
    [createBlockStore(name)],
    [
      ['-> ', '%s', ''],
      [value, '%o', ''],
      [fileName, '%s', styles.file],
      [name, '%s', styles.file],
    ],
  );
}

export function eventCalled(name: string, fileName: string, payload: any): void {
  log(
    [createBlockEvent(name)],
    [
      [payload, '%o', 'padding-left: 4px;'],
      [fileName, '%s', styles.file],
      [name, '%s', styles.file],
    ],
  );
}

export function effectCalled(name: string, fileName: string, parameters: any): void {
  log(
    [createBlockEffect(name)],
    [
      [parameters, '%o', 'padding-left: 4px;'],
      [fileName, '%s', styles.file],
      [name, '%s', styles.file],
    ],
  );
}

export function effectDone(name: string, fileName: string, parameters: any, result: any): void {
  log(
    [createBlockEffect(name)],
    [
      ['done ✅', '%s', styles.emoji],
      [parameters, '(%o)', 'padding-left: 4px;'],
      ['-> ', '%s', ''],
      [result, '%o', 'padding: 0;'],
      [fileName, '%s', styles.file],
      [name, '%s', styles.file],
    ],
  );
}

export function effectFail(name: string, fileName: string, parameters: any, error: any): void {
  const instanceofError = error instanceof Error;

  log(
    [createBlockEffect(name)],
    [
      ['fail ❌', '%s', styles.emoji],
      [parameters, '(%o)', 'padding-left: 4px;'],
      ['-> ', '%s', ''],
      instanceofError ? [String(error), '%s', ''] : [error, '%o', 'padding: 0;'],
      [fileName, '%s', styles.file],
      [name, '%s', styles.file],
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
