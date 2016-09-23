'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Eigenstate;

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _utils = require('../utils');

var _assertions = require('../validation/assertions');

var assert = _interopRequireWildcard(_assertions);

var _errorMessages = require('../validation/errorMessages');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Eigenstate(changes, onChange, context) {

  onChange && assert.onChangePropIsFunction(onChange);

  var latestChangeInvocationID = Math.random(); //consider starting at 0 and incrementing

  /*stateDef with wrapped change functions*/
  var eigenstate = (0, _utils.mapObjectTreeLeaves)(changes, function (change, key, path, parent) {

    // Not a change -- just state. So no wrapping required.
    if (!(change instanceof Function)) return change;

    var armedChange = function performChangeWithContext(payload, illegalSecondArgument) {

      assert.changeWasNotPassedSecondArgument(illegalSecondArgument, key, path);

      var contextState = (0, _objectAssign2.default)({}, context.state);
      var contextStateAtPath = (0, _utils.getValueByPath)(contextState, path);

      var thisChangeInvocationID = Math.random();
      latestChangeInvocationID = thisChangeInvocationID;

      var localChangeResults = change(payload, contextStateAtPath);
      assert.changeResultsFitStateDef(localChangeResults, parent, key, path);

      var newLocalState = (0, _objectAssign2.default)({}, contextStateAtPath, localChangeResults);

      if (newLocalState !== undefined) {

        assert.noOtherChangesHaveBeenInvoked(thisChangeInvocationID, latestChangeInvocationID);

        var newState = (0, _utils.mutSetValueByPath)(contextState, path, newLocalState); //semantics? (const, mut...)
        context.setState(newState);
      }

      onChange && onChange({
        key: key,
        path: path,
        payload: payload,
        localEigenstate: contextStateAtPath,
        changeResults: localChangeResults,
        nextLocalEigenstate: newLocalState
      });
    };

    armedChange.__definition = change;

    return armedChange;
  });

  return eigenstate;
}