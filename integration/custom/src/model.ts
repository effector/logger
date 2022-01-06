import {createStore, createEvent } from "effector";
import { createInspector } from 'effector-inspector';

export const thingHappened = createEvent()
export const $counter = createStore(0).on(thingHappened, s => s + 1)

// otherwise console.info fires to early, before jest can mock it :(
// didn't found any good way to test it better
setTimeout(createInspector);
