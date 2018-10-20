import { module, test } from 'qunit';
import TestDebugInfoSummary, { getSummary } from 'ember-qunit/-internal/test-debug-info-summary';
import TestDebugInfo from 'ember-qunit/-internal/test-debug-info';
import { MockConsole, getSettledState, debugInfo } from './utils/test-isolation-helpers';

module('TestDebugInfoSummary', function() {
  test('hasDebugInfo returns true if TestDebugInfos have been added', function(assert) {
    assert.expect(1);

    let testDebugInfoSummary = new TestDebugInfoSummary();

    testDebugInfoSummary.add(new TestDebugInfo('foo', 'bar', {}));
    testDebugInfoSummary.add(new TestDebugInfo('ding', 'bat', {}));

    assert.ok(testDebugInfoSummary.hasDebugInfo);
  });

  test('reset correctly resets to default values', function(assert) {
    assert.expect(2);

    let testDebugInfoSummary = new TestDebugInfoSummary();

    testDebugInfoSummary.add(new TestDebugInfo('foo', 'bar', {}));
    testDebugInfoSummary.add(new TestDebugInfo('ding', 'bat', {}));

    assert.ok(testDebugInfoSummary.hasDebugInfo);

    testDebugInfoSummary.reset();

    assert.notOk(testDebugInfoSummary.hasDebugInfo);
  });

  test('printToConsole correctly prints minimal information', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();
    let testDebugInfoSummary = new TestDebugInfoSummary();

    testDebugInfoSummary.add(new TestDebugInfo('foo', 'bar', getSettledState()));
    testDebugInfoSummary.add(new TestDebugInfo('ding', 'bat', getSettledState()));

    testDebugInfoSummary.printToConsole(mockConsole);

    assert.deepEqual(
      mockConsole.toString(),
      `Tests not isolated
foo: bar
ding: bat`
    );
  });

  test('printToConsole correctly prints all information', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();
    let testDebugInfoSummary = new TestDebugInfoSummary();

    testDebugInfoSummary.add(
      new TestDebugInfo('foo', 'bar', getSettledState(true, true), debugInfo)
    );
    testDebugInfoSummary.add(
      new TestDebugInfo('ding', 'bat', getSettledState(false, true, false, true, 2), debugInfo)
    );

    testDebugInfoSummary.printToConsole(mockConsole);

    assert.deepEqual(
      mockConsole.toString(),
      `Tests not isolated
foo: bar
Pending timers: 2
STACK
STACK
Active runloops: YES
ding: bat
Pending AJAX requests: 2
Active runloops: YES`
    );
  });

  test('formatForBrowser correctly prints minimal information', function(assert) {
    assert.expect(1);

    let testDebugInfoSummary = new TestDebugInfoSummary();

    testDebugInfoSummary.add(new TestDebugInfo('foo', 'bar', getSettledState()));
    testDebugInfoSummary.add(new TestDebugInfo('ding', 'bat', getSettledState()));

    let browserOutput = testDebugInfoSummary.formatForBrowser();

    assert.equal(browserOutput, getSummary(2, 0, ['foo: bar', 'ding: bat']));
  });

  test('formatForBrowser correctly prints all information', function(assert) {
    assert.expect(1);

    let testDebugInfoSummary = new TestDebugInfoSummary();

    testDebugInfoSummary.add(
      new TestDebugInfo('foo', 'bar', getSettledState(true, true), debugInfo)
    );
    testDebugInfoSummary.add(
      new TestDebugInfo('ding', 'bat', getSettledState(false, true, false, true, 2), debugInfo)
    );

    let browserOutput = testDebugInfoSummary.formatForBrowser();

    assert.equal(
      browserOutput,
      getSummary(
        2,
        [
          'Pending AJAX requests: 2',
          'Pending timers: 4',
          'Pending scheduled items: 4',
          'Active runloops: YES',
        ],
        ['foo: bar', 'ding: bat']
      )
    );
  });
});
