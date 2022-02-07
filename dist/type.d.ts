import { Dispatch, SetStateAction } from 'react';
export declare type ShallowSetStateAction<S, R = Partial<S>> = R | ((prevState: Readonly<S>) => R);
export declare type StoreApi<State> = Readonly<{
    get: () => State;
    set: Dispatch<SetStateAction<State>>;
    shallow: Dispatch<ShallowSetStateAction<State>>;
}>;
export declare type ActionCreator<State, Action = any> = (api: StoreApi<State>) => Action;
export declare type ActionConfig<State, Action = any> = {
    [key in keyof Action]: ActionCreator<State, Action[key]>;
};
export interface StoreProps<State, Action = any> {
    name?: string;
    state: State;
    action: ActionCreator<State, Action> | ActionConfig<State, Action>;
}
export declare type ContainerLifePoint<State, Action = any> = (api: StoreApi<State>, action: Action) => void;
export declare type ContainerLifeCycle<State, Action = any> = {
    create?: ContainerLifePoint<State, Action>;
    update?: ContainerLifePoint<State, Action>;
    dispose?: ContainerLifePoint<State, Action>;
};
export declare type HookSelector<V, S, F extends any[] = never> = (value: V, ...flags: F) => S;
