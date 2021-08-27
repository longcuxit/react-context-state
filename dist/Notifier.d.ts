declare type Listener = () => void;
export declare class Notifier {
    private _listens;
    get hasListen(): boolean;
    addListen(listener: Listener): () => void;
    protected notify(): void;
}
export declare class ValueChanged<V> extends Notifier {
    private _value;
    constructor(_value: V);
    get value(): V;
    set value(value: V);
}
export {};
