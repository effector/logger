import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app';

const root = document.querySelector('#root');

const render = () => {
  if (root) {
    ReactDOM.render(
        <App />,
      root,
    );
  }
};

if (module.hot) {
  module.hot.accept('./app', render);
}

render();
