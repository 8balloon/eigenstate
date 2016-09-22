'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.leavesAreFunctions = leavesAreFunctions;
exports.middlewareIsValid = middlewareIsValid;
exports.updateWasNotPassedSecondArgument = updateWasNotPassedSecondArgument;
exports.newStateMatchesDefinition = newStateMatchesDefinition;

var _utils = require('../utils');

var _errorMessages = require('./errorMessages');

var errorMessages = _interopRequireWildcard(_errorMessages);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// js assertions

function isObject(value, errorMessage) {

  if (!(value instanceof Object) || value instanceof Function || value === null) {
    throw new Error(errorMessage);
  }
}

function isFunction(value, errorMessage) {

  if (!(value instanceof Function)) {
    throw new Error(errorMessage);
  }
}

function leavesAreFunctions(objTree, errorMessage) {

  (0, _utils.mapObjectTreeLeaves)(objTree, function (val, key, path) {

    if (!(val instanceof Function)) {
      throw new Error(errorMessage + '(At: ' + path.join('.') + '.' + key + ')');
    }
  });
}

// validation assertions

function middlewareIsValid(middleware) {

  isFunction(middleware, errorMessages.middlewareIsNotFunction);
}

function updateWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (illegalSecondArgument !== undefined) {
    throw new Error(errorMessages.tooManyUpdateArguments(key));
  }
}

function newStateMatchesDefinition(newState, originalState, key, path) {

  for (var prop in originalState) {
    if (!(prop in newState)) {
      throw new Error(errorMessages.newStateLacksShapeOfOriginalState(key, path, prop));
    }

    var newValue = newState[prop];

    if (newValue instanceof Function) {

      var newBaseUpdateFunction = newValue.__baseUpdateFunction;
      var originalBaseUpdateFunction = originalState[prop];

      if (newBaseUpdateFunction !== originalBaseUpdateFunction) {
        throw new Error(errorMessages.updateFunctionWasChanged(key, path, prop));
      }
    }
  }
}