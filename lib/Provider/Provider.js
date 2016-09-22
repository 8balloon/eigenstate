'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = undefined;

var _WrappedUpdates = require('./WrappedUpdates');

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