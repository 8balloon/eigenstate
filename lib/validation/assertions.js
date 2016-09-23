'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.leavesAreFunctions = leavesAreFunctions;
exports.onChangePropIsFunction = onChangePropIsFunction;
exports.changeWasNotPassedSecondArgument = changeWasNotPassedSecondArgument;
exports.noOtherChangesHaveBeenInvoked = noOtherChangesHaveBeenInvoked;
exports.changeResultsFitStateDef = changeResultsFitStateDef;

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

function onChangePropIsFunction(onChange) {

  isFunction(onChange, errorMessages.onChangePropIsNotFunction);
}

function changeWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (illegalSecondArgument !== undefined) {
    throw new Error(errorMessages.tooManyChangeArguments(key));
  }
}

function containsNoFunctions(objTree, errorMessage) {
  (0, _utils.mapObjectTreeLeaves)(objTree, function (val) {
    if (val instanceof Function) {
      throw new Error(errorMessage);
    }
  });
}

function noOtherChangesHaveBeenInvoked(thisChangeInvocationID, latestChangeInvocationID) {
  if (thisChangeInvocationID !== latestChangeInvocationID) {
    throw new Error('Change ' + key + ' at path ' + path + ' is incorrectly composed, and will result in an inconsistent state when used. Changes should return a value OR call other changes. See "Changes: Operations and Procedures" at ' + documentationURL);
  }
}

function changeResultsFitStateDef(stateChanges, stateDefinitions, key, path) {

  for (var prop in stateChanges) {
    if (!(prop in stateDefinitions)) {
      throw new Error(errorMessages.newStateLacksShapeOfOriginalState(key, path, prop)); //revisit
    }

    var stateChange = stateChanges[prop]; //need renaming
    var stateDefinition = stateDefinitions[prop];

    if (stateDefinition instanceof Function) {
      if (!(stateChange instanceof Function)) {
        throw new Error("State change function was replaced!!"); //revisit
      }

      if (stateChange.__definition !== stateDefinition) {
        throw new Error(errorMessages.changeFunctionWasChanged(key, path, prop));
      }
    } else {
      //if value, ok
      if (stateDefinition instanceof Object && stateDefinition !== null) {
        if (!(stateChange instanceof Object) || stateChange === null) {
          containsNoFunctions(stateDefinition, 'A change function that was defined has been removed by change yayhda at path yayadadada'); //revisit
        } else {
          changeResultsFitStateDef(stateChange, stateDefinition, key, path); //are key and path correct here?
        }
      }
    }
  }
}