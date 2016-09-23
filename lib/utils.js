'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapObjectTreeLeaves = mapObjectTreeLeaves;
exports.getValueByPath = getValueByPath;
exports.mutSetValueByPath = mutSetValueByPath;

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function mapObjectValues(obj, mapFunction) {
  return _objectAssign2.default.apply({}, Object.keys(obj).map(function (key) {
    return _defineProperty({}, key, mapFunction(obj[key], key, obj));
  }));
}

function mapObjectTreeLeaves(obj, mapFunction, keyPath) {

  var path = keyPath || [];

  return mapObjectValues(obj, function (val, key) {
    if (val instanceof Object && !(val instanceof Function) && !(val === null)) {
      return mapObjectTreeLeaves(val, mapFunction, [].concat(path, key));
    } else {
      return mapFunction(val, key, path, obj);
    }
  });
}

function getValueByPath(obj, path) {

  var value = obj;
  var keys = path.slice();

  while (keys.length) {
    value = value[keys.shift()];
  }

  return value;
}

//mutates obj
function mutSetValueByPath(obj, path, value) {

  if (!path.length) return value;

  var parent = obj;
  var keysTo = path.slice(0, -1);
  var keyOf = path[path.length - 1];

  while (keysTo.length) {
    parent = parent[keysTo.shift()];
  }

  parent[keyOf] = value;

  return obj;
}