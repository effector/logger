# Effector Logger with Inspector

![Chrome-DevTools-Console](https://i.imgur.com/TZF1t4U.png)

## Installation

1. Install effector and logger

```bash
npm install -D effector-logger effector
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

## Inspector

1. Replace `"effector"` to `"effector-logger"` in modules you need to debug

Optionally you can replace all `effector` imports to `effector-logger` to debug all units from effector. (`alias` for webpack)

2. Create inspector

In your `index.ts` (or .js) file add next lines.

```ts
import { createInspector } from 'effector-logger';

createInspector();
```

3. Press HOT keys to open inspector

By default: `CTRL+B` in your application

4. Watch your stores and its values

![Effector-Inspector](https://i.imgur.com/D5oqpLv.png)
