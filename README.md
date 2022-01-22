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
npm install effector
npm install --dev effector-logger
```

or yarn

```bash
yarn add effector
yarn add -D effector-logger
```

> Note: **effector-logger** requires `effector` to be installed

## Usage

Add babel plugin to your `babel.config.js` or `.babelrc` file

```json
{
  "plugins": ["effector-logger/babel-plugin"]
}
```

**Options**

Babel plugin has few configuration options:
- `inspector: boolean` - enables or disables `effector-inspector`. Default: `false`
- `effector: EffectorBabelPluginOptions` - overrides for underlying `effector/babel-plugin`. Default: `{}`

Config example:
```json
{
 "plugins": [["effector-logger/babel-plugin", {
     "inspector": true,
     "effector": {
        "reactSsr": true,
        "factories": ["shared/lib/effector-timer", "effector-forms"]},
  }]]
}
```

### Create React App and macros support

Just use `effector-logger/macro`:

```js
import { createStore, createEvent } from 'effector-logger/macro';
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

### Debug domain _with settings_

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

#### Settings available only on `attachLogger`

Second argument is an object `{ reduxDevtools, console, inspector }`, each field is optional can be `"enabled"` or `"disabled"`.
If field is not provided it is `"enabled"` by default.

- `reduxDevtools` if `"disabled"` do not send updates to [redux devtools extension](https://github.com/zalmoxisus/redux-devtools-extension)
- `inspector` if `"disabled"` do not send updates to effector inspector
- `console` if `"disabled"` do not log updates to `console.log` in browser devtools

```ts
// disable all logs
attachLogger(myDomain, {
  reduxDevtools: 'disabled',
  inspector: 'disabled',
  console: 'disabled',
});
```

### Hide any unit from log

Sometimes it is required to hide some events or stores from log.
It is simple to implement: just call `configure` on your unit.

```ts
import { createEvent } from 'effector'
import { configure } from 'effector-logger'
import { $data, loadDataFx } from './model'

const pageMounted = createEvent<number>();

configure(pageMounted, { log: 'disabled' })

// You can pass multiple units as array
configure([$data, loadDataFx], { log: 'disabled' })
```

## effector-root

Just import `root` domain and attach:

```js
import { attachLogger } from 'effector-logger/attach';
import { root } from 'effector-root';

attachLogger(root);
```

#### Create React App and macros support

```js
import { attachLogger } from 'effector-logger/attach';
import { root } from 'effector-root/macro';

attachLogger(root);
```

## Inspector

Just import `effector-logger/inspector` in the `app.ts` and open DevTools Console in browser. 

> Note: inspector requires browser environment. ReactNative is not supported

```js
import 'effector-logger/inspector';
```

Then press `CTRL+B` to open Inspector inside the app.

## Redux DevTools support

If you have redux devtools extensions, just open it.

## Using in the project with Redux

If you are using `effector@21.2.2` and lower with `effector-logger` in the project with redux, then you need to rewrite redux `createStore` import to `createReduxStore` and use it.
Otherwise, redux will give you an error: **Unexpected keys found in preloadedState argument passed to createStore**.

```ts
import { createStore as createReduxStore } from 'redux';

const store = createReduxStore();
// reducers
```

## Using logger with SSR

```ts
import { attachLogger } from 'effector-logger/attach';
import { root, fork, hydrate } from 'effector-root';

const scope = fork(root);
hydrate(scope, { values: INITIAL_STATE });
attachLogger(scope);
```

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
