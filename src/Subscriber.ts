import { SetStateAction } from 'react'
import { ValueChanged } from './Notifier'
import { ShallowSetStateAction, StoreApi } from './type'

export class Subscriber<V, A> extends ValueChanged<V> {
  action: A

  get api() {
    return {
      get: () => this.value,
      set: (value: SetStateAction<V>) => {
        if (value instanceof Function) this.value = value(this.value)
        else this.value = value
      },
      shallow: (value: ShallowSetStateAction<V>) => {
        let nextValue: Partial<V>
        if (value instanceof Function) nextValue = value(this.value)
        else nextValue = value
        const changed = Object.keys(nextValue).find((key) => {
          return nextValue[key] !== this.value[key]
        })
        if (changed) {
          this.value = Object.assign({}, this.value, nextValue)
        }
      }
    }
  }

  constructor(value: V, createAction: (api: StoreApi<V>) => A) {
    super(value)
    this.action = createAction(this.api)
  }
}
