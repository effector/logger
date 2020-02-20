# Effector Logger with Inspector

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

![Chrome-DevTools-Console](https://i.imgur.com/Q50UnR3.png)

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

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
