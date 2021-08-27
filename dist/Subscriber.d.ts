import { SetStateAction } from 'react';
import { ValueChanged } from './Notifier';
import { ShallowSetStateAction, StoreApi } from './type';
export declare class Subscriber<V, A> extends ValueChanged<V> {
    action: A;
    get api(): {
        get: () => V;
        set: (value: SetStateAction<V>) => void;
        shallow: (value: ShallowSetStateAction<V>) => void;
    };
    constructor(value: V, createAction: (api: StoreApi<V>) => A);
}
