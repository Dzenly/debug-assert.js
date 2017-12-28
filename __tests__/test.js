#!/usr/bin/env node
'use strict';

process.env.DEBUG_ASSERT_LOG_PASSED = 'yes';

const dAssert = require('../index.js');

function foo() {
  dAssert.true(1 === 1, '1 must be equal to 1');
  dAssert.cond.true(2 === 3, '2 must be equal to 3, no such string, cause no DEBUG_ASSERT');
  dAssert.true(1 === 3, '1 must be equal to 3');
}

function bar() {
  foo();
}

bar();
