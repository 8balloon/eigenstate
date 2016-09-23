'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _Eigenstate = require('./Eigenstate');

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

      return React.cloneElement(this.props.children, this.state);
    }
  }]);

  return Provider;
}(React.Component);

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
};