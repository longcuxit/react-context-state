import { Store } from 'react-context-state'

const state = { a: 0, b: 0 }
type StateType = typeof state

const store = new Store({
  name: 'ObjectStore',
  state,
  action: ({ get, set, shallow }) => ({
    reset: () => set({ a: 0, b: 0 }),

    add(key: keyof StateType) {
      shallow({ [key]: get()[key] + 1 })
    }
  })
})

export const useObject = store.createHook(
  (state, flag: 'a' | 'b') => state[flag]
)
