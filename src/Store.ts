import {
  Context,
  createContext,
  createElement,
  ReactNode,
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
    type Props = { state: State; children: ReactNode }

    const firePoint = (
      store: Subscriber<State, Action>,
      fire?: ContainerLifePoint<State, Action>
    ) => fire && fire(store.api, store.action)

    return ({ children, state }: Props) => {
      const [store] = useState(() => new Subscriber(state, _createAction))

      useEffect(() => {
        firePoint(store, cycle.create)
        return () => firePoint(store, cycle.dispose)
      }, [store])

      useEffect(() => {
        if (store.value !== state) {
          store.value = state
          firePoint(store, cycle.update)
        }
      }, [state, store])

      return createElement(Context.Provider, { value: store, children })
    }
  }

  createSubscriber() {
    const { Context } = this
    type Props = { children: (state: State, action: Action) => ReactNode }

    return ({ children }: Props) => {
      const context = useContext(Context)
      return children(context.value, context.action)
    }
  }

  createHook<Value = State, Flags extends any[] = never>(
    selector?: HookSelector<State, Value, Flags>
  ) {
    const { Context } = this
    type Select = (state: State, ...flags: Flags) => Value
    const select = (selector || ((v) => v)) as Select
    return (...flags: Flags): [Value, Action] => {
      const store = useContext(Context)
      const [state, setState] = useState(() => select(store.value, ...flags))

      useEffect(() => {
        setState(select(store.value, ...flags))
        return store.addListen(() => setState(select(store.value, ...flags)))
      }, [store, ...flags])

      return [state, store.action]
    }
  }

  createHookAction() {
    return () => useContext(this.Context).action
  }
}
