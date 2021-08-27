import { Context } from 'react';
import { StoreProps, HookSelector, ContainerLifeCycle, ContainerLifePoint } from './type';
import { Subscriber } from './Subscriber';
export declare class Store<State, Action> {
    private Context;
    private _createAction;
    constructor({ state, action, name }: StoreProps<State, Action>);
    createContainer(cycle?: ContainerLifeCycle<State, Action>): {
        new (props: {
            state: State;
        }): {
            store: Subscriber<State, Action>;
            firePoint: (fire?: ContainerLifePoint<State, Action> | undefined) => void;
            shouldComponentUpdate(next: {
                state: State;
            }): boolean;
            componentWillUnmount(): void;
            render(): import("react").FunctionComponentElement<import("react").ProviderProps<Subscriber<State, Action>>>;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{
                state: State;
            }>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<{
                state: State;
            }> & Readonly<{
                children?: import("react").ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: import("react").ReactInstance;
            };
            componentDidMount?(): void;
            componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<{
                state: State;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<{
                state: State;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<{
                state: State;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{
                state: State;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<{
                state: State;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<{
                state: State;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string | undefined;
        contextType?: Context<any> | undefined;
    };
    createHook<Value = State, Flag = void>(selector?: HookSelector<State, Value, Flag>): (flag: Flag) => [Value, Action];
    createAction(): () => Action;
}
