import {
  Component,
  Context,
  createContext,
  createElement,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  StoreProps,
  HookSelector,
  ContainerLifeCycle,
  ContainerLifePoint,
  ActionCreator
} from './type'
import { Subscriber } from './Subscriber'

export class Store<State, Action> {
  private Context: Context<Subscriber<State, Action>>
  private _createAction: ActionCreator<State, Action>

  constructor({ state, action, name }: StoreProps<State, Action>) {
    if (typeof action === 'function') {
      this._createAction = action
    } else {
      this._createAction = (api) => {
        const actions = {} as Action
        Object.keys(action).forEach((key) => {
          actions[key] = action[key](api)
        })
        return actions
      }
    }
    this.Context = createContext(new Subscriber(state, this._createAction))
    this.Context.displayName = name
  }

  createContainer(cycle: ContainerLifeCycle<State, Action> = {}) {
    const { Context, _createAction } = this
    type Props = { state: State }

    return class extends Component<Props> {
      static displayName = Context.displayName
      store: Subscriber<State, Action>
      constructor(props: Props) {
        super(props)
        this.store = new Subscriber(props.state, _createAction)
        this.firePoint(cycle.create)
      }

      firePoint = (fire?: ContainerLifePoint<State, Action>) => {
        fire && fire(this.store.api, this.store.action)
      }

      shouldComponentUpdate(next: Props) {
        if (next.state !== this.props.state) {
          this.store.value = next.state
          this.firePoint(cycle.update)
          return true
        }
        return false
      }

      componentWillUnmount() {
        this.firePoint(cycle.dispose)
      }

      render() {
        const { children } = this.props
        return createElement(Context.Provider, { value: this.store, children })
      }
    }
  }

  createHook<Value = State, Flag = void>(
    selector?: HookSelector<State, Value, Flag>
  ) {
    const { Context } = this
    type Select = (state: State, flag: Flag) => Value
    const select = (selector || ((v) => v)) as Select
    return (flag: Flag): [Value, Action] => {
      const store = useContext(Context)
      const [state, setState] = useState(() => select(store.value, flag))

      useEffect(() => {
        setState(select(store.value, flag))
        return store.addListen(() => setState(select(store.value, flag)))
      }, [store, flag])

      return [state, store.action]
    }
  }

  createAction() {
    return () => useContext(this.Context).action
  }
}
