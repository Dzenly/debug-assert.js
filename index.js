const AssertionError = require('assert').AssertionError;
const callsite = require('callsite');
const fs = require('fs');

const oneArgCheckers = require('./one-arg-checkers.js');
const twoArgsCheckers = require('./two-args-checkers.js');

/**
 * Returns src line.
 * @param stack - call stack.
 * @return {string} - line from src file.
 */
function getSrcLine(stack) {
  const call = stack[1];
  const file = call.getFileName();
  const lineno = call.getLineNumber();
  let src = fs.readFileSync(file, 'utf8');
  const line = src.split('\n')[lineno - 1].trim();
  return line;
}

function throwError(stack, msg, userMsg) {

  const line = getSrcLine(stack);

  const err = new AssertionError({
    message: '\nMSG: ' + msg + '\nUSER MSG: ' + userMsg + '\nLINE: ' + line,
    stackStartFunction: stack[0].getFunction(),
  });

  throw err;
}

let logger = null;

exports.setLogger = function setLogger(argLogger) {
  logger = argLogger;
};

let logPassed = function() {};
if (process.env.DEBUG_ASSERT_LOG_PASSED) {
  logPassed = function(stack) {
    const logStr = 'OK: ' + getSrcLine(stack);
    if (!logger) {
      console.log(logStr);
      return;
    }
    logger.silly(logStr);
  }
}

// /**
//  * Checks if expr is true.
//  * @param expr - expression to check for true.
//  * @param [message = ''] - message to print in case of assertion fail.
//  */
// exports.true = function checkTrue(expr, message = '') {
//   if (expr) {
//     return;
//   }
//   throwError(callsite(), message);
// };
//
// /**
//  * Checks if expr is true.
//  * @param expr - expression to check for ip v4 or v6.
//  * @param [message = ''] - message to print in case of assertion fail.
//  */
// exports.ip = function ip(expr, message = '') {
//   if (!validator.isIP(expr)) {
//     return;
//   }
//   throwError(callsite(), message);
// };

Object.keys(oneArgCheckers)
  .forEach(function (key) {

    if (typeof exports[key] !== 'undefined') {
      throw new Error('Keys duplication');
    }

    if (typeof oneArgCheckers[key] === 'function') {
      exports[key] = function (expr, userMsg = '') {
        const result = oneArgCheckers[key](expr);
        if (typeof result === 'string') {
          throwError(callsite(), result, userMsg);
        }
        logPassed(callsite());
      }
    }
  });

Object.keys(twoArgsCheckers)
  .forEach(function (key) {

    if (typeof exports[key] !== 'undefined') {
      throw new Error('Keys duplication');
    }

    if (typeof twoArgsCheckers[key] === 'function') {
      exports[key] = function (arg1, arg2, userMsg = '') {
        const result = twoArgCheckers[key](arg1, arg2);
        if (typeof result === 'string') {
          throwError(callsite(), result, userMsg);
        }
        logPassed(callsite());
      }
    }
  });

// =====================================================================
//
// Let's assign exports.cond to function from export if DEBUG_ASSERT is set,
// or to empty functions, if DEBUG_ASSERT is not set.
if (process.env.DEBUG_ASSERT) {
  exports.cond = exports;
} else {
  exports.cond = {}; // Object for conditional checks.
  Object.keys(exports)
    .forEach(function (key) {
      if (typeof exports[key] === 'function') {
        exports.cond[key] = function () {
        };
      }
    });
}



