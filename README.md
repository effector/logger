# Effector Logger with Inspector

![Chrome-DevTools-Console](https://i.imgur.com/TZF1t4U.png)

## Installation

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

## Usage

Add babel plugin to your `babel.config.js` or `.babelrc` file

> babel-plugin included to effector package

```json
{
  "plugins": [["effector/babel-plugin", { "addLoc": true }]]
}
```

### Debug some modules

1. Open a module (js/ts/esm file) you need to debug

Replace import from `"effector"` to `"effector-logger"`

For example:

```diff
- import { Event, Store, createEvent, forward } from "effector"
+ import { Event, Store, createEvent, forward } from "effector-logger"
```

2. Open DevTools Console, use "Filter" to show only required logs

### Debug domain

1. Open a module with domain
2. `import { attachLogger } from 'effector-logger/attach'`
3. Attach logger to your domain

Example:

```ts
import { createDomain } from 'effector';
import { attachLogger } from 'effector-logger/attach';

export const myDomain = createDomain('my');
attachLogger(myDomain);
```

## Redux DevTools support

If you have redux devtools extensions, just open it.
