module.exports =
/******/ (function(modules) { // webpackBootstrap
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

	var _logVerbosely = __webpack_require__(8);

	Object.defineProperty(exports, 'logVerbosely', {
	  enumerable: true,
	  get: function get() {
	    return _logVerbosely.logVerbosely;
	  }
	});

	var _connect = __webpack_require__(9);

	Object.defineProperty(exports, 'connect', {
	  enumerable: true,
	  get: function get() {
	    return _connect.connect;
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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _assertions = __webpack_require__(4);

	var assert = _interopRequireWildcard(_assertions);

	var _Eigenstate = __webpack_require__(7);

	var _Eigenstate2 = _interopRequireDefault(_Eigenstate);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Provider = exports.Provider = function (_React$Component) {
	  _inherits(Provider, _React$Component);

	  function Provider(props, context) {
	    _classCallCheck(this, Provider);

	    var _this = _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this, props, context));

	    _this.__eigenstate = null;

	    _this.stateAccessor = {
	      getState: function getState() {
	        return _this.__eigenstate;
	      },
	      setState: function setState(newState, callback) {
	        _this.__eigenstate = newState;
	        _this.forceUpdate(callback && callback());
	        /*
	        We are not calling onEvent callbacks until React has updated.
	        This is to make Eigenstate apps easier to reason about from the perspective of an external application.
	        */
	      }
	    };

	    _this.__eigenstate = (0, _Eigenstate2.default)(props, _this.stateAccessor);
	    return _this;
	  }

	  _createClass(Provider, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return {
	        providerProps: this.props,
	        eigenstate: this.stateAccessor.getState()
	      };
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      if (this.props.eigenstate) {
	        this.props.eigenstate(function () {
	          return _this2.stateAccessor.getState();
	        });
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(next) {
	      var _props = this.props;
	      var stateDef = _props.stateDef;
	      var onEvent = _props.onEvent;


	      if (stateDef !== next.stateDef || onEvent !== next.onEvent) {

	        this.stateAccessor.setState((0, _Eigenstate2.default)(next, this.stateAccessor));
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {

	      assert.stateDoesNotConflictWithProps(this.__eigenstate, this.props);

	      var childProps = (0, _objectAssign2.default)({}, this.__eigenstate, this.props);

	      return _react2.default.cloneElement(this.props.children, childProps);
	    }
	  }]);

	  return Provider;
	}(_react2.default.Component);

	Provider.childContextTypes = {
	  providerProps: _react2.default.PropTypes.object.isRequired,
	  eigenstate: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("object-assign");

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
	exports.stateDefIsObject = stateDefIsObject;
	exports.onEventPropIsFunction = onEventPropIsFunction;
	exports.stateDoesNotConflictWithProps = stateDoesNotConflictWithProps;
	exports.methodWasNotPassedSecondArgument = methodWasNotPassedSecondArgument;
	exports.operationCompletedSynchronously = operationCompletedSynchronously;
	exports.methodReturnFitsStateDef = methodReturnFitsStateDef;

	var _utils = __webpack_require__(5);

	var _errorMessages = __webpack_require__(6);

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

	function stateDefIsObject(stateDef) {

	  if (!(stateDef instanceof Object) || stateDef instanceof Function || stateDef === null) {
	    throw new Error(errorMessages.stateDefIsNotObject);
	  }
	}

	function onEventPropIsFunction(onEvent) {

	  isFunction(onEvent, errorMessages.onEventPropIsNotFunction);
	}

	function stateDoesNotConflictWithProps(state, props, key) {
	  //props is likely (hopefully) smaller
	  for (var key in props) {
	    if (key in state) {
	      console.warn(errorMessages.statePropConflict(key));
	    }
	  }
	}

	function methodWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

	  if (illegalSecondArgument !== undefined) {
	    throw new Error(errorMessages.tooManyMethodArguments(key));
	  }
	}

	function operationCompletedSynchronously(thisInvocationID, latestInvocationID, key, path) {
	  if (thisInvocationID !== latestInvocationID) {
	    throw new Error(errorMessages.operationInvokedOtherMethod(key, path));
	  }
	}

	function containsNoFunctions(obj, errorMessage) {

	  if (obj instanceof Function) {
	    throw new Error(errorMessage);
	  }

	  if (!(obj instanceof Object) || obj === null) return;

	  (0, _utils.mapObjectTreeLeaves)(obj, function (val) {
	    if (val instanceof Function) {
	      throw new Error(errorMessage);
	    }
	  });
	}

	function methodReturnFitsStateDef(newState, stateDefinitions, key, path) {

	  isObject(newState, errorMessages.methodDidNotReturnObject(key, path));

	  for (var localKey in newState) {

	    var statePropertyDefinition = stateDefinitions[localKey];
	    containsNoFunctions(statePropertyDefinition, errorMessages.methodWasOverwritten(key, path, localKey));
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mapObjectTreeLeaves = mapObjectTreeLeaves;
	exports.getValueByPath = getValueByPath;
	exports.mutSetValueByPath = mutSetValueByPath;

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function mapObjectValues(obj, mapFunction) {

	  if (obj instanceof Array) return obj.map(mapFunction);

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

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.statePropConflict = statePropConflict;
	exports.tooManyMethodArguments = tooManyMethodArguments;
	exports.methodDidNotReturnObject = methodDidNotReturnObject;
	exports.methodWasOverwritten = methodWasOverwritten;
	exports.operationInvokedOtherMethod = operationInvokedOtherMethod;
	var documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md';

	var stateDefIsNotObject = exports.stateDefIsNotObject = "A stateDef object is required by the Eigenstate Provider";
	var methodsLeavesNotFunctions = exports.methodsLeavesNotFunctions = 'Switchless Provider.props.methods must contain values that are Functions';
	var onMethodPropIsNotFunction = exports.onMethodPropIsNotFunction = 'Switchless Provider onMethod must be a Function';

	function statePropConflict(key) {
	  return 'There was a conflict between state "' + key + '" and prop "' + key + '" on an Eigenstate <Provider> child or an Eigenstate connect()ed component. You are encouraged to avoid state/prop conflicts. State is being overridden by props.';
	}

	function tooManyMethodArguments(key, path) {
	  return 'Method "' + key + '" at path "' + path + '" was called with multiple arguments. Methods may only be invoked with a single argument. See ' + documentationURL;
	}

	function methodDidNotReturnObject(key, path) {
	  return 'Method "' + key + '" at path "' + path + '" did not return an object. Values must be returned via { key: value } objects. See ' + documentationURL;
	}

	function methodWasOverwritten(key, path, localKey) {
	  return 'Method "' + key + '" at path "' + path + '" returned a value which overwrote a method at key "' + localKey + '". Methods may not be overwritten.';
	}

	function operationInvokedOtherMethod(key, path) {
	  return 'Method ' + key + ' at path ' + path + ' is incorrectly composed, and will result in an inconsistent state when used. Methods should return a value XOR call other methods. See ' + documentationURL;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Eigenstate;

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _utils = __webpack_require__(5);

	var _assertions = __webpack_require__(4);

	var assert = _interopRequireWildcard(_assertions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	An Eigenstate is a stateDef + wrapped state methods that update context state values.
	The wrapped state methods returned by Eigenstate remain unchanged and accessible via the context, but state values are updated by those state methods, so they change.
	This means that the values of the original Eigenstate instance are overwritten, while its methods remain the same.
	It is consistent because it is changing in a way which was a part of its definition.
	*/

	function Eigenstate(props, stateAccessor) {
	  var stateDef = props.stateDef;
	  var onEvent = props.onEvent;
	  var getState = stateAccessor.getState;
	  var setState = stateAccessor.setState;


	  assert.stateDefIsObject(stateDef);
	  onEvent && assert.onEventPropIsFunction(onEvent);

	  var latestInvocationID = 0;

	  var eigenstate = (0, _utils.mapObjectTreeLeaves)(stateDef, function (property, key, path, localStateDef) {

	    // Not a method -- just a value. So no "arming" required.
	    if (!(property instanceof Function)) return property;
	    var method = property;

	    return function armedMethod(payload, illegalSecondArgument) {

	      assert.methodWasNotPassedSecondArgument(illegalSecondArgument, key, path);

	      var contextState = getState();
	      var contextStateAtPath = (0, _utils.getValueByPath)(contextState, path);

	      var thisInvocationID = latestInvocationID + 1;
	      latestInvocationID = thisInvocationID;

	      var localMethodReturn = method(payload, contextStateAtPath);

	      if (localMethodReturn !== undefined) {
	        (function () {
	          //this method is a synchronous operation, not a procedure

	          assert.operationCompletedSynchronously(thisInvocationID, latestInvocationID, key, path);
	          assert.methodReturnFitsStateDef(localMethodReturn, localStateDef, key, path);

	          var newLocalState = (0, _objectAssign2.default)({}, contextStateAtPath, localMethodReturn);

	          var newState = (0, _utils.mutSetValueByPath)(contextState, path, newLocalState); //semantics? (const, mut...)
	          setState(newState, function () {

	            onEvent && onEvent({
	              methodKey: key,
	              methodPath: path,
	              payload: payload,
	              returnValue: localMethodReturn,
	              previousLocalState: contextStateAtPath,
	              localState: newLocalState,
	              state: getState()
	            });
	          });
	        })();
	      } else {
	        // this method is an asynchronous procedure, so no value has been returned, and state has not been directly changed.
	        onEvent && onEvent({
	          methodKey: key,
	          methodPath: path,
	          payload: payload,
	          returnValue: undefined,
	          previousLocalState: contextStateAtPath,
	          localState: contextStateAtPath,
	          state: getState()
	        });
	      }
	    };
	  });

	  return eigenstate;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.logVerbosely = logVerbosely;
	function logVerbosely(details) {
	  var methodKey = details.methodKey;
	  var methodPath = details.methodPath;
	  var payload = details.payload;
	  var returnValue = details.returnValue;
	  var previousLocalState = details.previousLocalState;
	  var localState = details.localState;
	  var state = details.state;


	  console.log('--> ' + (methodPath.join('.') + '.' + methodKey) + ' <-- METHOD CALLED');
	  console.log('PAYLOAD / RETURN:', payload, returnValue);
	  console.log('STATE AT METHOD, BEFORE / AFTER:', previousLocalState, localState);
	  console.log('COMPLETE STATE RESULT:', state);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.connect = connect;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _assertions = __webpack_require__(4);

	var assert = _interopRequireWildcard(_assertions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function connect(Component) {
	  var Connect = function (_React$Component) {
	    _inherits(Connect, _React$Component);

	    function Connect(props, context) {
	      _classCallCheck(this, Connect);

	      return _possibleConstructorReturn(this, (Connect.__proto__ || Object.getPrototypeOf(Connect)).call(this, props, context));
	    }

	    _createClass(Connect, [{
	      key: 'render',
	      value: function render() {

	        assert.stateDoesNotConflictWithProps(this.context.eigenstate, this.props);

	        var componentProps = (0, _objectAssign2.default)({}, this.context.providerProps, this.context.eigenstate, this.props);

	        return _react2.default.createElement(Component, componentProps);
	      }
	    }]);

	    return Connect;
	  }(_react2.default.Component);

	  Connect.contextTypes = {
	    providerProps: _react2.default.PropTypes.object.isRequired,
	    eigenstate: _react2.default.PropTypes.object.isRequired
	  };

	  return Connect;
	}

/***/ }
/******/ ]);