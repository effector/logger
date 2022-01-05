import React from "react";
import {useStore, useEvent} from "effector-react";
import {$counter, thingHappened} from "./model";
import './App.css';

function App() {
  const c = useStore($counter)
  const up = useEvent(thingHappened)

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => up()}>{c}</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
