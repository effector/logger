// @ts-ignore
const reduxDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
let stores: any = {};

export const updateStore = (name: string, state: any) => {
  if (reduxDevTools) {
    stores[name] = state;
  }
}

export const log = (type: string, name: string, payload: any, result?: any) => {
  if (reduxDevTools) {
    if (type === 'STORE') {
      updateStore(name, payload);
    }
    reduxDevTools.send({ type: `${type} ${name}`, payload, result }, stores);
  }
}
