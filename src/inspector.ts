/* eslint-disable @typescript-eslint/no-use-before-define, @typescript-eslint/ban-ts-ignore, @typescript-eslint/no-unnecessary-type-assertion */
import {
  createStore,
  createEvent,
  Store,
  Event,
  Effect,
  Domain,
  createApi,
} from 'effector';
import { using, h, spec, list, map } from 'effector-dom';

function createStorage<T>(name: string) {
  const $store = createStore<T[]>([], { name: `$${name}Storage` });
  const api = createApi($store, {
    add: (storage, element: T) => [...storage, element],
  });
  return { $store, api };
}

const stores = createStorage<Store<any>>('stores');
const events = createStorage<Event<any>>('events');
const effects = createStorage<Effect<any, any, any>>('effects');
const domains = createStorage<Domain>('domain');

export const addStore = stores.api.add;
export const addEvent = events.api.add;
export const addEffect = effects.api.add;
export const addDomain = domains.api.add;

export function createInspector() {
  const root = document.createElement('div');
  root.classList.add('effector-inspector');

  document.body.append(root);

  Root(root);

  return { root };
}

function Root(root: HTMLElement) {
  const $showInspector = createStore<boolean>(false);
  const togglePressed = createEvent();
  const KeyB = 2;

  console.info(
    '%c[effector-inspector] %cPress %cCTRL+B %cto open Inspector',
    'color: gray; font-size: 1rem;',
    'color: black; font-size: 1rem;',
    'color: blue; font-family: monospace; font-size: 1rem;',
    'color: black; font-size: 1rem;',
  );

  $showInspector.on(togglePressed, (show) => !show);
  document.addEventListener('keypress', (event) => {
    const ev = event as KeyboardEvent;

    if (ev.keyCode === KeyB && ev.ctrlKey) {
      togglePressed();
    }
  });

  using(root, () => {
    h('div', () => {
      spec({ style: styles.root, visible: $showInspector });
      Stores();
    });
  });
}

function Stores() {
  h('div', { style: styles.sectionHead, text: 'Stores' });
  h('div', () => {
    spec({ style: styles.storesTable });
    list(stores.$store, ({ store }) => {
      h('div', () => {
        spec({
          style: styles.store,
          attr: {
            title: store.map(
              (real) => (real as any).defaultConfig?.loc?.file ?? '',
            ),
          },
        });

        const $name = map(store, {
          fn: (real) => real.compositeName.path.slice(1).join('/'),
        });

        h('pre', () => {
          spec({
            style: styles.storeName,
            // @ts-ignore
            text: $name,
          });
        });
        h('pre', () => {
          spec({
            style: styles.storeValue,
            // @ts-ignore
            text: store.getState().map((value) => JSON.stringify(value)),
          });
        });
      });
    });
  });
}

const styles = {
  root: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    bottom: '3rem',
    boxShadow:
      '0 14.5px 5.2px -10px rgba(0,0,0,0.038), 0 23.9px 16.6px -10px rgba(0,0,0,0.057), 0 64px 118px -10px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    left: '3rem',
    overflowX: 'auto',
    position: 'fixed',
    top: '3rem',
    userSelect: 'none',
    width: '26rem',
  },
  sectionHead: {
    backgroundColor: 'white',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    display: 'flex',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    left: 0,
    lineHeight: '2rem',
    padding: '0.5rem 1rem',
    position: 'sticky',
    right: 0,
    top: 0,
  },
  storesTable: {
    display: 'table',
  },
  store: {
    display: 'table-row',
    fontSize: '1rem',
  },
  storeName: {
    margin: 0,
    display: 'table-cell',
    padding: '0.5rem 1rem',
  },
  storeValue: {
    margin: 0,
    display: 'table-cell',
    padding: '0.5rem 1rem',
  },
};
