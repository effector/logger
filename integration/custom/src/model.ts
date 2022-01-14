import {createStore, createEvent } from "effector";


export const thingHappened = createEvent()
export const $counter = createStore(0).on(thingHappened, s => s + 1)
