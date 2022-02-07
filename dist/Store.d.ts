import { ReactNode } from 'react';
import { StoreProps, HookSelector, ContainerLifeCycle } from './type';
import { Subscriber } from './Subscriber';
export declare class Store<State, Action> {
    private Context;
    private _createAction;
    constructor({ state, action, name }: StoreProps<State, Action>);
    createContainer(cycle?: ContainerLifeCycle<State, Action>): ({ children, state }: {
        state: State;
        children: ReactNode;
    }) => import("react").FunctionComponentElement<import("react").ProviderProps<Subscriber<State, Action>>>;
    createSubscriber(): ({ children }: {
        children: (state: State, action: Action) => ReactNode;
    }) => ReactNode;
    createHook<Value = State, Flags extends any[] = never>(selector?: HookSelector<State, Value, Flags>): (...flags: Flags) => [Value, Action];
    createHookAction(): () => Action;
}
