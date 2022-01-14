import React from 'react';
import {useStore, useEvent} from "effector-react";
import {$counter, thingHappened} from "./model";

export const App = () => {
  const c = useStore($counter)
  const up = useEvent(thingHappened)
  return (
    <div onClick={() => up()}>app count: {c}</div>
  );
};
