import { Store } from 'react-context-state'

const store = new Store({
  name: 'Toggle',
  state: false,
  action({ set }) {
    return (state?: boolean) => set((prev) => state ?? !prev)
  }
})
// hook re-render when state changed
export const useToggle = store.createHook()

// hook get only action and does not re-render when state change
export const useToggleAction = store.createHookAction()

// Context Provider container of this store
export const ToggleContainer = store.createContainer({
  // trigger on container will be mount
  // action is return value when store instance created
  create(api, action) {
    console.log(api.get())
    console.log(action)
  }
})
