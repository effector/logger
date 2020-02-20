import debounce from 'just-debounce-it';
import { Effect, Event, Store } from 'effector';
import { createName, getPath } from './lib';

const storeListToInit: Array<Store<any>> = [];
const eventListToInit: Array<Event<any>> = [];
const effectListToInit: Array<Effect<any, any, any>> = [];

const firstLabel = (bgColor: string, color: string) =>
  `background-color:${bgColor}; color:${color}; padding: 0 4px; border-radius: 4px 0 0 4px`;
const nextLabel = (bgColor: string, color: string) =>
  `background-color:${bgColor}; color:${color}; padding: 0 4px;`;

const logAdded = debounce(() => {
  const stores = storeListToInit.splice(0);
  const events = eventListToInit.splice(0);
  const effects = effectListToInit.splice(0);

  if (stores.length + events.length + effects.length > 0) {
    console.groupCollapsed(
      `%c${"☄"}%c${"new"}%c Initialized events (${events.length}) effects (${effects.length}) stores (${stores.length})`,
      firstLabel("#ff8a65", "#000"),
      nextLabel("#29b6f6", "#000"),
      nextLabel("transparent", "currentColor"),
    );
    stores.length > 0 && stores.forEach(store => {
      const name = createName(store.compositeName);
      const fileName = getPath(store);

      console.info(
        `%c${"☄"}%c${"new"}%c${"store"}%c%s->%o %c%s`,
        firstLabel("#ff8a65", "#000"),
        nextLabel("#29b6f6", "#000"),
        nextLabel("#7e57c2", "#fff"),
        nextLabel("transparent", "currentColor"),
        name,
        store.defaultState,
        nextLabel("transparent", "#9e9e9e"),
        fileName,
      );
    })
    events.length > 0 && events.forEach(event => {
      const name = createName(event.compositeName);
      const fileName = getPath(event);

      console.info(
        `%c${"☄"}%c${"new"}%c${"event"}%c%s %c%s`,
        firstLabel("#ff8a65", "#000"),
        nextLabel("#29b6f6", "#000"),
        nextLabel("#9ccc65", "#000"),
        nextLabel("transparent", "currentColor"),
        name,
        nextLabel("transparent", "#9e9e9e"),
        fileName,
      );
    })
    effects.length > 0 && stores.forEach(effect => {
      const name = createName(effect.compositeName);
      const fileName = getPath(effect);

      console.info(
        `%c${"☄"}%c${"new"}%c${"effect"}%c%s %c%s`,
        firstLabel("#ff8a65", "#000"),
        nextLabel("#29b6f6", "#000"),
        nextLabel("#26a69a", "#000"),
        nextLabel("transparent", "currentColor"),
        name,
        nextLabel("transparent", "#9e9e9e"),
        fileName,
      );
    })
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
  console.info(
    `%c${"☄"}%c${"store"}%c%s->%o %c%s`,
    firstLabel("#ff8a65", "#000"),
    nextLabel("#7e57c2", "#fff"),
    nextLabel("transparent", "currentColor"),
    name,
    value,
    nextLabel("transparent", "#9e9e9e"),
    fileName,
  );
}

export function eventCalled(
  name: string,
  fileName: string,
  payload: any,
): void {
  console.log(
    `%c${"☄"}%c${"event"}%c%s->%o %c%s`,
    firstLabel("#ff8a65", "#000"),
    nextLabel("#9ccc65", "#000"),
    nextLabel("transparent", "currentColor"),
    name,
    payload,
    nextLabel("transparent", "#9e9e9e"),
    fileName,
  );
}

export function effectCalled(
  name: string,
  fileName: string,
  parameters: any,
): void {
  console.log(
    `%c${"☄"}%c${"effect"}%c%s->%o %c%s`,
    firstLabel("#ff8a65", "#000"),
    nextLabel("#26a69a", "#000"),
    nextLabel("transparent", "currentColor"),
    name,
    parameters,
    nextLabel("transparent", "#9e9e9e"),
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
    `%c${"☄"}%c${"effect"}%c${"D"}%c%s->%o %c%s`,
    firstLabel("#ff8a65", "#000"),
    nextLabel("#26a69a", "#000"),
    nextLabel("#66bb6a", "#000"),
    nextLabel("transparent", "currentColor"),
    name,
    parameters,
    nextLabel("transparent", "#9e9e9e"),
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
    `%c${"☄"}%c${"effect"}%c${"F"}%c%s->%o %c%s`,
    firstLabel("#ff8a65", "#000"),
    nextLabel("#26a69a", "#000"),
    nextLabel("#ef5350", "#000"),
    nextLabel("transparent", "currentColor"),
    name,
    parameters,
    nextLabel("transparent", "#9e9e9e"),
    fileName,  );
}
