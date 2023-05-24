# Effector Logger

Pretty logger for stores, events, effects and domains.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

| ![Chrome-DevTools-Console](https://i.imgur.com/Pp4zPKy.png)      |
| ---------------------------------------------------------------- |
| ![Chrome-DevTools-Console-Dark](https://i.imgur.com/Vg54DsD.png) |

## Installation

```bash
npm add effector
npm add --dev effector-logger
```

or yarn

```bash
yarn add effector
yarn add -D effector-logger
```

> Note: **effector-logger** requires `effector` to be installed

## Usage

### Prepare metadata

To make logs more useful we need additional metadata (like names, locations in the code, etc), which is provided by one of the `effector` plugins.

#### Babel-plugin

Babel-plugin is built-in in the `effector` package.

Just add it to your babel configuration.

```json
{
  "plugins": ["effector/babel-plugin"]
}
```

It is also useful to enable `loc` generation for dev environment, to see for exact locations of units in the code.

```json
{
  "plugins": [["effector/babel-plugin", { "addLoc": true }]]
}
```

[Read the docs](https://effector.dev/docs/api/effector/babel-plugin/#usage)

#### SWC Plugin

[Read effector SWC plugin documentation](https://github.com/effector/swc-plugin)

### Start logging

Just call `attachLogger` in your entrypoint module.

NOTE: To "see" the `createStore`, `createEvent`, etc calls `effector-logger` needs to be imported at the very top of your entrypoint module. This way initial states of stores will be properly logged at the moment of `attachLogger` call.

Update logs are not affected by import order.

```ts
// src/index.tsx
import { attachLogger } from 'effector-logger';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { appStarted } from './shared/app-events';

attachLogger();

appStarted();

createRoot(document.querySelector('#app')).render(<App />);
```

After that you will see the logs in your console.

### With `Scope`

If your app uses scope (e.g. you have Server-Side-Rendering) - you will need to pass it to the logger to work.

```ts
attachLogger({ scope });
```

Updates related to provided scope will be prefixed with scope id.

### Name

There optional `name` prefix to the logs.
It can be useful if there are few instances of your app, which are using different scopes or if you just want prefix that is better than boring scope id.

```ts
attachLogger({
  scope,
  name: `my-cool-app-${appId}`, // all logs will be prefixed with this string
});
```

### Stop logs

To stop logs just call unsubscribe function.

```ts
const unlogger = attachLogger();

unlogger();
```

### Hide any unit from log

Sometimes it is required to hide some events or stores from log.
It is simple to implement: just call `configure` on your unit.

```ts
import { createEvent } from 'effector';
import { configure } from 'effector-logger';
import { $data, loadDataFx } from './model';

const pageMounted = createEvent<number>();

configure(pageMounted, { log: 'disabled' });

// You can pass multiple units as array
configure([$data, loadDataFx], { log: 'disabled' });
```

### Force any unit to be logged

By default only non-derived units are logged. If you want to force some unit to be logged, use configure `enabled`

```ts
import { createEvent } from 'effector';
import { configure } from 'effector-logger';
import { $data, loadDataFx } from './model';

const pageMounted = createEvent<number>();

const mappedMounted = pageMounter.map((x) => x);

configure(mappedMounted, { log: 'enabled' });

// You can pass multiple units as array
configure([$data, loadDataFx], { log: 'enabled' });
```

### Whitelist mode

If you wan't to disable logs by default and only log necessary units, you can use `mode` option of `createLogger`

```ts
import { createEvent } from 'effector';
import { configure, attachLogger } from 'effector-logger';

// In whitelist mode, units don't log by default
attachLogger({ mode: 'whitelist' })

const pageMounted = createEvent<number>();

// Enable logging for a specific unit
configure(pageMounted, { log: 'enabled' });
```

## Redux DevTools support

Redux DevTools is moved to a different package.

See the [`@effector/redux-devtools-adapter`](https://github.com/effector/redux-devtools-adapter)

## Contributors ✨

Thanks go to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Laiff"><img src="https://avatars0.githubusercontent.com/u/575885?v=4" width="100px;" alt=""/><br /><sub><b>Andrey Antropov</b></sub></a><br /><a href="https://github.com/sergeysova/effector-logger/commits?author=Laiff" title="Code">💻</a></td>
    <td align="center"><a href="https://sova.dev"><img src="https://avatars0.githubusercontent.com/u/5620073?v=4" width="100px;" alt=""/><br /><sub><b>Sergey Sova</b></sub></a><br /><a href="https://github.com/sergeysova/effector-logger/commits?author=sergeysova" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Sozonov"><img src="https://avatars2.githubusercontent.com/u/1931637?v=4" width="100px;" alt=""/><br /><sub><b>Sozonov</b></sub></a><br /><a href="https://github.com/sergeysova/effector-logger/commits?author=Sozonov" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Release process

1. Check out the [draft release](https://github.com/effector/logger/releases).
1. All PRs should have correct labels and useful titles. You can [review available labels here](https://github.com/effector/logger/blob/master/.github/release-drafter.yml).
1. Update labels for PRs and titles, next [manually run the release drafter action](https://github.com/effector/logger/actions/workflows/release-drafter.yml) to regenerate the draft release.
1. Review the new version and press "Publish"
1. If required check "Create discussion for this release"
