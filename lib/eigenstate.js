(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("eigenstate", [], factory);
	else if(typeof exports === 'object')
		exports["eigenstate"] = factory();
	else
		root["eigenstate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Provider = __webpack_require__(1);

	Object.defineProperty(exports, 'Provider', {
	  enumerable: true,
	  get: function get() {
	    return _Provider.Provider;
	  }
	});

	var _logger = __webpack_require__(6);

	Object.defineProperty(exports, 'updateLogger', {
	  enumerable: true,
	  get: function get() {
	    return _logger.updateLogger;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Provider = undefined;

	var _WrappedUpdates = __webpack_require__(2);

	var _WrappedUpdates2 = _interopRequireDefault(_WrappedUpdates);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Provider = exports.Provider = React.createClass({

	  componentWillMount: function componentWillMount() {
	    var _props = this.props;
	    var updates = _props.updates;
	    var middleware = _props.middleware;


	    var wrappedUpdates = (0, _WrappedUpdates2.default)(updates, middleware, this);
	    this.setState(wrappedUpdates);
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var _props2 = this.props;
	    var updates = _props2.updates;
	    var middleware = _props2.middleware;
	    var newUpdates = nextProps.newUpdates;
	    var newMiddleware = nextProps.newMiddleware;


	    if (updates !== newUpdates || middleware !== newMiddleware) {

	      var wrappedUpdates = (0, _WrappedUpdates2.default)(newUpdates, newMiddleware, this);
	      this.setState(wrappedUpdates);
	    }
	  },

	  render: function render() {

	    var childProps = Object.assign({}, this.props, this.state);

	    return React.cloneElement(this.props.children, childProps);
	  }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = WrappedUpdates;

	var _utils = __webpack_require__(3);

	var _assertions = __webpack_require__(4);

	var assert = _interopRequireWildcard(_assertions);

	var _errorMessages = __webpack_require__(5);

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

	    return function performUpdateConsideringMiddleware(payload, illegalSecondArgument) {

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
	  });

	  return wrappedUpdates;
	}
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mapObjectTreeLeaves = mapObjectTreeLeaves;
	exports.getValueByPath = getValueByPath;
	exports.mutSetValueByPath = mutSetValueByPath;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function mapObjectValues(obj, mapFunction) {
	  return Object.assign.apply({}, Object.keys(obj).map(function (key) {
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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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

	var _utils = __webpack_require__(3);

	var _errorMessages = __webpack_require__(5);

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
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tooManyUpdateArguments = tooManyUpdateArguments;
	exports.newStateLacksShapeOfOriginalState = newStateLacksShapeOfOriginalState;
	var documentationURL = exports.documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md';

	var noProviderUpdatesProp = exports.noProviderUpdatesProp = 'Switchless Provider requires an "updates" property';
	var updatesLeavesNotFunctions = exports.updatesLeavesNotFunctions = 'Switchless Provider.props.updates must contain values that are Functions';
	var middlewareIsNotFunction = exports.middlewareIsNotFunction = 'Switchless Provider middleware must be a Function';

	function tooManyUpdateArguments(key, path) {
	  return 'Update "' + key + '" at path "' + path + '" was called with multiple arguments. Updates may only be invoked with a single argument; see ' + documentationURL;
	}

	function newStateLacksShapeOfOriginalState(key, path, prop) {
	  return 'Update "' + key + '" at path "' + path + '" returned a state which lacks property "' + prop + '". You cannot remove properties defined via Provider.updates.';
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updateLogger = updateLogger;
	function updateLogger(executeUpdate, payload, extras) {
	  var key = extras.key;
	  var getState = extras.getState;


	  console.log("UPDATE KEY:", key);
	  console.log("PAYLOAD:", payload);

	  executeUpdate(payload);

	  console.log("NEXT STATE:", getState());
	}

/***/ }
/******/ ])
});
;