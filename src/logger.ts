import debounce from 'just-debounce-it';
import { Store } from 'effector';
import { createName, getPath } from './lib';

const storeListToInit: Array<Store<any>> = [];

const logStore = debounce(() => {
  const list = storeListToInit.splice(0);
  if (list.length > 0) {
    console.groupCollapsed(
      `[effector-logger] Initialized stores (${list.length})`,
    );
    for (const store of list) {
      const name = createName(store.compositeName);
      const fileName = getPath(store);

      console.log(
        '[effector-logger] %cSTORE%c %s VALUE(%o) %c%s',
        'color: deepskyblue;',
        'color: currentColor;',
        name,
        store.defaultState,
        'color: gray',
        fileName,
      );
    }
    console.groupEnd();
  }
}, 5);

export function storeAdded(store: Store<any>): void {
  storeListToInit.push(store);
  logStore();
}

export function storeUpdated(name: string, fileName: string, value: any): void {
  console.log(
    '[effector-logger] %cSTORE%c %s VALUE(%o) %c%s',
    'color: deepskyblue;',
    'color: currentColor;',
    name,
    value,
    'color: gray',
    fileName,
  );
}

export function eventCalled(
  name: string,
  fileName: string,
  payload: any,
): void {
  console.log(
    '[effector-logger] %cEVENT%c %s PAYLOAD(%O) %c%s',
    'color: magenta;',
    'color: currentColor;',
    name,
    payload,
    'color: gray;',
    fileName,
  );
}

export function effectCalled(
  name: string,
  fileName: string,
  parameters: any,
): void {
  console.log(
    '[effector-logger] %cEFFECT%c %s PARAMS(%o) %c%s',
    'color: orange;',
    'color: currentColor;',
    name,
    parameters,
    'color: gray',
    fileName,
  );
}

export function effectDone(
  name: string,
  fileName: string,
  parameters: any,
  result: any,
): void {
  console.log(
    '[effector-logger] %cEFFECT DONE%c %s PARAMS(%o) -> %o %c%s',
    'color: green;',
    'color: currentColor;',
    name,
    parameters,
    result,
    'color: gray',
    fileName,
  );
}

export function effectFail(
  name: string,
  fileName: string,
  parameters: any,
  error: any,
): void {
  console.log(
    '[effector-logger] %cEFFECT FAIL%c %s PARAMS(%o) -> %o %c%s',
    'color: red;',
    'color: currentColor;',
    name,
    parameters,
    error,
    'color: gray',
    fileName,
  );
}
