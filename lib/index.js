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

	var _Eigenstate = __webpack_require__(4);

	var _Eigenstate2 = _interopRequireDefault(_Eigenstate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Provider = exports.Provider = function (_React$Component) {
	  _inherits(Provider, _React$Component);

	  function Provider(props, context) {
	    _classCallCheck(this, Provider);

	    var _this = _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this, props, context));

	    var stateDef = props.stateDef;
	    var onChange = props.onChange;


	    if (!(stateDef instanceof Object) || stateDef instanceof Function || stateDef === null) {
	      throw new Error("stateDef is required");
	    }

	    _this.state = (0, _Eigenstate2.default)(stateDef, onChange, _this);
	    return _this;
	  }

	  _createClass(Provider, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return {
	        eigenstate: this.state
	      };
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _props = this.props;
	      var stateDef = _props.stateDef;
	      var onChange = _props.onChange;


	      this.setState((0, _Eigenstate2.default)(stateDef, onChange, this));
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      if (this.props.onCreate) {
	        this.props.onCreate(function () {
	          return _this2.state;
	        });
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _props2 = this.props;
	      var stateDef = _props2.stateDef;
	      var onChange = _props2.onChange;


	      if (stateDef !== nextProps.stateDef || onChange !== nextProps.onChange) {

	        this.setState((0, _Eigenstate2.default)(nextProps.stateDef, nextProps.onChange, this));
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {

	      return _react2.default.cloneElement(this.props.children, this.state);
	    }
	  }]);

	  return Provider;
	}(_react2.default.Component);

	Provider.childContextTypes = {
	  eigenstate: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Eigenstate;

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _utils = __webpack_require__(5);

	var _assertions = __webpack_require__(6);

	var assert = _interopRequireWildcard(_assertions);

	var _errorMessages = __webpack_require__(7);

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
/***/ function(module, exports, __webpack_require__) {

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

	var _utils = __webpack_require__(5);

	var _errorMessages = __webpack_require__(7);

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

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tooManyChangeArguments = tooManyChangeArguments;
	exports.newStateLacksShapeOfOriginalState = newStateLacksShapeOfOriginalState;
	exports.changeFunctionWasChanged = changeFunctionWasChanged;
	var documentationURL = exports.documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md';

	var noProviderChangesProp = exports.noProviderChangesProp = 'Switchless Provider requires an "changes" property';
	var changesLeavesNotFunctions = exports.changesLeavesNotFunctions = 'Switchless Provider.props.changes must contain values that are Functions';
	var onChangePropIsNotFunction = exports.onChangePropIsNotFunction = 'Switchless Provider onChange must be a Function';

	function tooManyChangeArguments(key, path) {
	  return 'Change "' + key + '" at path "' + path + '" was called with multiple arguments. Changes may only be invoked with a single argument; see ' + documentationURL;
	}

	function newStateLacksShapeOfOriginalState(key, path, prop) {
	  return 'Change "' + key + '" at path "' + path + '" returned a state which lacks property "' + prop + '". You cannot remove properties defined via Provider.changes.';
	}

	function changeFunctionWasChanged(key, path, prop) {
	  return 'Change "' + key + '" at path "' + path + '" returned a state which lacks the original change function with key "' + prop + '". You cannot change udpate functions at runtime.';
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.logVerbosely = logVerbosely;
	function logVerbosely(details) {
	  var key = details.key;
	  var path = details.path;
	  var payload = details.payload;
	  var contextStateAtPath = details.contextStateAtPath;
	  var localChangeResults = details.localChangeResults;
	  var newLocalState = details.newLocalState;


	  console.log("CHANGE DETAILS:", details);
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
	        return _react2.default.createElement(Component, this.context.eigenstate);
	      }
	    }]);

	    return Connect;
	  }(_react2.default.Component);

	  Connect.contextTypes = {
	    eigenstate: _react2.default.PropTypes.object.isRequired
	  };

	  return Connect;
	}

/***/ }
/******/ ]);