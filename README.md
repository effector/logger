# Effector Logger with Inspector

![Chrome-DevTools-Console](https://i.imgur.com/TZF1t4U.png)

## Installation

1. Install effector and logger

```bash
npm install effector
npm install --dev effector-logger
```

or yarn

```bash
yarn add effector
yarn add -D effector-logger
```

**effector-logger** requires `effector` to be installed

2. Add babel plugin to your `babel.config.js` or `.babelrc` file

> babel-plugin included to effector package

```json
{
  "plugins": [["effector/babel-plugin", { "addLoc": true }]]
}
```

3. Open a module (js/ts/esm file) you need to debug

Replace import from `"effector"` to `"effector-logger"`

For example:

```diff
- import { Event, Store, createEvent, forward } from "effector"
+ import { Event, Store, createEvent, forward } from "effector-logger"
```

4. Open DevTools Console, use "Filter" to show only required logs

## Redux DevTools

If you have redux devtools extensions, just open it.
