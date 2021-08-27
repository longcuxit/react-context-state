import React from 'react'
import {} from 'react-context-state'
import { useObject } from './Store.object'
import { ToggleContainer, useToggle } from './Store.toggle'

const Check = () => {
  const [toggle, setToggle] = useToggle()

  return (
    <label>
      <input type='checkbox' checked={toggle} onChange={() => setToggle()} />
      Toggle store
    </label>
  )
}

const Counter = ({ flag }: { flag: 'a' | 'b' }) => {
  const [num, action] = useObject(flag)
  return (
    <button type='button' onClick={() => action.add(flag)}>
      Num "{flag}": {num}
    </button>
  )
}

const App = () => {
  return (
    <div>
      <div>
        <Check />
        <Check />
      </div>

      <div>
        <ToggleContainer state={true}>
          <Check />
        </ToggleContainer>
        <ToggleContainer state={false}>
          <Check />
        </ToggleContainer>
      </div>

      <div>
        <Counter flag='a' />
        <Counter flag='b' />
      </div>
    </div>
  )
}

export default App
