'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WrappedUpdates;

var _utils = require('../utils');

var _assertions = require('../validation/assertions');

var assert = _interopRequireWildcard(_assertions);

var _errorMessages = require('../validation/errorMessages');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function WrappedUpdates(updates, middleware, providerContext) {

  middleware && assert.middlewareIsValid(middleware);

  var getState = function getState() {
    return providerContext.state;
  };

  var latestUpdateInvocationID = Math.random();

  var wrappedUpdates = (0, _utils.mapObjectTreeLeaves)(updates, function (update, key, path, parent) {

    if (!(update instanceof Function)) return update;

    var performUpdate = function performUpdate(resolvedPayload) {

      var state = providerContext.state;
      var stateAtPath = (0, _utils.getValueByPath)(state, path);
      var wrappedUpdatesAtPath = (0, _utils.getValueByPath)(wrappedUpdates, path);

      var thisUpdateInvocationID = Math.random();
      latestUpdateInvocationID = thisUpdateInvocationID;

      var newLocalState = update(resolvedPayload, stateAtPath, wrappedUpdatesAtPath);

      if (newLocalState !== undefined) {

        if (thisUpdateInvocationID !== latestUpdateInvocationID) {
          throw new Error('Update ' + key + ' at path ' + path + ' is incorrectly composed, and will result in an inconsistent state when used. Updates should return a value OR call other updates. See "Updates: Operations and Procedures" at ' + _errorMessages.documentationURL);
        }

        assert.newStateMatchesDefinition(newLocalState, parent, key, path);

        var newState = (0, _utils.mutSetValueByPath)(state, path, newLocalState);
        providerContext.setState(newState);
      }
    };

    var wrappedUpdate = function performUpdateConsideringMiddleware(payload, illegalSecondArgument) {

      assert.updateWasNotPassedSecondArgument(illegalSecondArgument, key, path);

      if (middleware) {

        middleware(performUpdate, payload, {
          key: key,
          path: path,
          updates: wrappedUpdates,
          getState: getState
        });
      } else {
        performUpdate(payload);
      }
    };

    wrappedUpdate.__baseUpdateFunction = update;

    return wrappedUpdate;
  });

  return wrappedUpdates;
}