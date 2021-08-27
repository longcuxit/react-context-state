import { Dispatch, SetStateAction } from 'react';
export declare type ShallowSetStateAction<S, R = Partial<S>> = R | ((prevState: Readonly<S>) => R);
export declare type StoreApi<State> = Readonly<{
    get: () => State;
    set: Dispatch<SetStateAction<State>>;
    shallow: Dispatch<ShallowSetStateAction<State>>;
}>;
export declare type ActionCreator<State, Action> = (api: StoreApi<State>) => Action;
export declare type ActionConfig<State, Action> = {
    [key in keyof Action]: (api: StoreApi<State>) => Action[key];
};
export interface StoreProps<State, Action> {
    name?: string;
    state: State;
    action: ActionCreator<State, Action> | ActionConfig<State, Action>;
}
export declare type ContainerLifePoint<State, Action> = (api: StoreApi<State>, action: Action) => void;
export declare type ContainerLifeCycle<State, Action> = {
    create?: ContainerLifePoint<State, Action>;
    update?: ContainerLifePoint<State, Action>;
    dispose?: ContainerLifePoint<State, Action>;
};
export declare type HookSelector<V, S, F = void> = (value: V, flag: F) => S;
