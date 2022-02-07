var react = require('react');

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var Notifier = /*#__PURE__*/function () {
  function Notifier() {
    this._listens = [];
  }

  var _proto = Notifier.prototype;

  _proto.addListen = function addListen(listener) {
    var _this = this;

    this._listens.push(listener);

    return function () {
      _this._listens.splice(_this._listens.indexOf(listener), 1);
    };
  };

  _proto.notify = function notify() {
    this._listens.forEach(function (listener) {
      return listener();
    });
  };

  _createClass(Notifier, [{
    key: "hasListen",
    get: function get() {
      return Boolean(this._listens.length);
    }
  }]);

  return Notifier;
}();
var ValueChanged = /*#__PURE__*/function (_Notifier) {
  _inheritsLoose(ValueChanged, _Notifier);

  function ValueChanged(_value) {
    var _this2;

    _this2 = _Notifier.call(this) || this;
    _this2._value = _value;
    return _this2;
  }

  _createClass(ValueChanged, [{
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      if (this._value === value) return;
      this._value = value;
      this.notify();
    }
  }]);

  return ValueChanged;
}(Notifier);

var Subscriber = /*#__PURE__*/function (_ValueChanged) {
  _inheritsLoose(Subscriber, _ValueChanged);

  function Subscriber(value, createAction) {
    var _this;

    _this = _ValueChanged.call(this, value) || this;
    _this.action = createAction(_this.api);
    return _this;
  }

  _createClass(Subscriber, [{
    key: "api",
    get: function get() {
      var _this2 = this;

      return {
        get: function get() {
          return _this2.value;
        },
        set: function set(value) {
          if (value instanceof Function) _this2.value = value(_this2.value);else _this2.value = value;
        },
        shallow: function shallow(value) {
          var nextValue;
          if (value instanceof Function) nextValue = value(_this2.value);else nextValue = value;
          var changed = Object.keys(nextValue).find(function (key) {
            return nextValue[key] !== _this2.value[key];
          });

          if (changed) {
            _this2.value = Object.assign({}, _this2.value, nextValue);
          }
        }
      };
    }
  }]);

  return Subscriber;
}(ValueChanged);

var Store = /*#__PURE__*/function () {
  function Store(_ref) {
    var state = _ref.state,
        action = _ref.action,
        name = _ref.name;

    if (typeof action === 'function') {
      this._createAction = action;
    } else {
      this._createAction = function (api) {
        var actions = {};
        Object.keys(action).forEach(function (key) {
          actions[key] = action[key](api);
        });
        return actions;
      };
    }

    this.Context = react.createContext(new Subscriber(state, this._createAction));
    this.Context.displayName = name;
  }

  var _proto = Store.prototype;

  _proto.createContainer = function createContainer(cycle) {
    if (cycle === void 0) {
      cycle = {};
    }

    var Context = this.Context,
        _createAction = this._createAction;

    var firePoint = function firePoint(store, fire) {
      return fire && fire(store.api, store.action);
    };

    return function (_ref2) {
      var children = _ref2.children,
          state = _ref2.state;

      var _useState = react.useState(function () {
        return new Subscriber(state, _createAction);
      }),
          store = _useState[0];

      react.useEffect(function () {
        firePoint(store, cycle.create);
        return function () {
          return firePoint(store, cycle.dispose);
        };
      }, [store]);
      react.useEffect(function () {
        if (store.value !== state) {
          store.value = state;
          firePoint(store, cycle.update);
        }
      }, [state, store]);
      return react.createElement(Context.Provider, {
        value: store,
        children: children
      });
    };
  };

  _proto.createSubscriber = function createSubscriber() {
    var Context = this.Context;
    return function (_ref3) {
      var children = _ref3.children;
      var context = react.useContext(Context);
      return children(context.value, context.action);
    };
  };

  _proto.createHook = function createHook(selector) {
    var Context = this.Context;

    var select = selector || function (v) {
      return v;
    };

    return function () {
      for (var _len = arguments.length, flags = new Array(_len), _key = 0; _key < _len; _key++) {
        flags[_key] = arguments[_key];
      }

      var store = react.useContext(Context);

      var _useState2 = react.useState(function () {
        return select.apply(void 0, [store.value].concat(flags));
      }),
          state = _useState2[0],
          setState = _useState2[1];

      react.useEffect(function () {
        setState(select.apply(void 0, [store.value].concat(flags)));
        return store.addListen(function () {
          return setState(select.apply(void 0, [store.value].concat(flags)));
        });
      }, [store].concat(flags));
      return [state, store.action];
    };
  };

  _proto.createHookAction = function createHookAction() {
    var _this = this;

    return function () {
      return react.useContext(_this.Context).action;
    };
  };

  return Store;
}();

exports.Notifier = Notifier;
exports.Store = Store;
exports.Subscriber = Subscriber;
exports.ValueChanged = ValueChanged;
//# sourceMappingURL=index.js.map
