import { $counter, thingHappened } from './model';

test('units have sids', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => null);

  expect($counter.sid).toMatchInlineSnapshot(`"evspfo"`);
  expect(thingHappened.sid).toMatchInlineSnapshot(`"-vjdci1"`);
  await new Promise((r) => setTimeout(r));
  expect(log.mock.calls.map((call) => call[0])).toMatchInlineSnapshot(`
    Array [
      "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%o  %c%s  %c%s",
      "%c%s%c  %c%s%c  %c%s%c  %c%s%c  %c%s  %c%s",
    ]
  `);

  log.mockRestore();
});
