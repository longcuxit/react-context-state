import { Store } from 'react-context-state'

const store = new Store({
  name: 'Toggle',
  state: false,
  action({ set }) {
    return (state?: boolean) => set((prev) => state ?? !prev)
  }
})

export const useToggle = store.createHook()
export const ToggleContainer = store.createContainer()
export const useToggleAction = store.createAction()
