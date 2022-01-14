/**
 * @jest-environment jsdom
 */

import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from './app';

test('logger does not breaks the app', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => null);

  render(createElement(App, {}));

  await new Promise((r) => setTimeout(r));

  const linkElement = screen.getByText(/app count: 0/i);

  expect(linkElement).toBeInTheDocument();
  expect(log.mock.calls.map((call) => call[0])).toMatchInlineSnapshot(`
    Array [
      "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
      "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%s",
    ]
  `);

  log.mockRestore();
});
