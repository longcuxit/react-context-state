import { Store } from 'react-context-state'

const store = new Store({
  state: { a: 0, b: 0 },
  action: {
    reset:
      ({ shallow }) =>
      () => {
        shallow({ a: 0, b: 0 })
      },
    add:
      ({ get, shallow }) =>
      (key: 'a' | 'b') => {
        shallow({ [key]: get()[key] + 1 })
      }
  }
})

export const useObject = store.createHook(
  (state, flag: 'a' | 'b') => state[flag]
)
