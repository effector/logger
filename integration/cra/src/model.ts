import {createStore, createEvent } from "effector-logger/macro";

export const thingHappened = createEvent()
export const $counter = createStore(0).on(thingHappened, s => s + 1)
