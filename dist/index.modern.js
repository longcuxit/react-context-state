import { useContext, useState, useEffect, createContext, createElement, Component } from 'react';

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

    this.Context = createContext(new Subscriber(state, this._createAction));
    this.Context.displayName = name;
  }

  var _proto = Store.prototype;

  _proto.createContainer = function createContainer(cycle) {
    if (cycle === void 0) {
      cycle = {};
    }

    var _a;

    var Context = this.Context,
        _createAction = this._createAction;
    return _a = /*#__PURE__*/function (_Component) {
      _inheritsLoose(_a, _Component);

      function _a(props) {
        var _this;

        _this = _Component.call(this, props) || this;

        _this.firePoint = function (fire) {
          fire && fire(_this.store.api, _this.store.action);
        };

        _this.store = new Subscriber(props.state, _createAction);

        _this.firePoint(cycle.create);

        return _this;
      }

      var _proto2 = _a.prototype;

      _proto2.shouldComponentUpdate = function shouldComponentUpdate(next) {
        if (next.state !== this.props.state) {
          this.store.value = next.state;
          this.firePoint(cycle.update);
          return true;
        }

        return false;
      };

      _proto2.componentWillUnmount = function componentWillUnmount() {
        this.firePoint(cycle.dispose);
      };

      _proto2.render = function render() {
        var children = this.props.children;
        return createElement(Context.Provider, {
          value: this.store,
          children: children
        });
      };

      return _a;
    }(Component), _a.displayName = Context.displayName, _a;
  };

  _proto.createHook = function createHook(selector) {
    var Context = this.Context;

    var select = selector || function (v) {
      return v;
    };

    return function (flag) {
      var store = useContext(Context);

      var _useState = useState(function () {
        return select(store.value, flag);
      }),
          state = _useState[0],
          setState = _useState[1];

      useEffect(function () {
        setState(select(store.value, flag));
        return store.addListen(function () {
          return setState(select(store.value, flag));
        });
      }, [store, flag]);
      return [state, store.action];
    };
  };

  _proto.createAction = function createAction() {
    var _this2 = this;

    return function () {
      return useContext(_this2.Context).action;
    };
  };

  return Store;
}();

export { Notifier, Store, Subscriber, ValueChanged };
//# sourceMappingURL=index.modern.js.map
