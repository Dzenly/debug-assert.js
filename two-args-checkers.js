'use strict';

//  Checkers with two arguments.
// If checker returns string - it is error message, if undefined - it is ok.

exports.eq = function eq(expr1, expr2) {
  if (expr1 !== expr2) {
    return `${expr1} !== ${expr2}`;
  }
};
