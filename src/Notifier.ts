type Listener = () => void

export class Notifier {
  private _listens: Listener[] = []

  get hasListen(): boolean {
    return Boolean(this._listens.length)
  }

  addListen(listener: Listener): () => void {
    this._listens.push(listener)
    return () => {
      this._listens.splice(this._listens.indexOf(listener), 1)
    }
  }

  protected notify(): void {
    this._listens.forEach((listener) => listener())
  }
}

export class ValueChanged<V> extends Notifier {
  constructor(private _value: V) {
    super()
  }

  get value(): V {
    return this._value
  }

  set value(value: V) {
    if (this._value === value) return
    this._value = value
    this.notify()
  }
}
