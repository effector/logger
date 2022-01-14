import { $counter, thingHappened } from './model';

test('units have sids', () => {
  expect($counter.sid).toMatchInlineSnapshot(`null`);
  expect(thingHappened.sid).toMatchInlineSnapshot(`null`);
});
