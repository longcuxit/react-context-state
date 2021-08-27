import { createStore, createHook } from './'
import { Subscriber } from './Subscriber'
import { createContainer, shallowAction } from './Store'

describe('Store:', () => {
  describe('Subscriber', () => {
    it('should action work inline', () => {
      const subscriber = new Subscriber(
        false,
        ({ get: getState, set: setState }) => {
          return () => setState(!getState())
        }
      )

      subscriber.action()
      expect(subscriber.value).toBe(true)
      subscriber.action()
      expect(subscriber.value).toBe(false)
    })

    it('should action work setSction', () => {
      const subscriber = new Subscriber(false, ({ set: setState }) => {
        return () => setState((state) => !state)
      })

      subscriber.action()
      expect(subscriber.value).toBe(true)
      subscriber.action()
      expect(subscriber.value).toBe(false)
    })

    it('should action multi actions', () => {
      const subscriber = new Subscriber(false, ({ set: setState }) => {
        return {
          setTrue: () => setState(true),
          setFalse: () => setState(false)
        }
      })

      subscriber.action.setTrue()
      expect(subscriber.value).toBe(true)
      subscriber.action.setFalse()
      expect(subscriber.value).toBe(false)
    })
  })

  describe('Hook', () => {
    const CounterStore = createStore({
      state: 0,
      action: ({ setState }) => {
        return () => setState((state) => state + 1)
      }
    })

    const withHook = (hook: () => [number, () => void]) => {
      return function Component() {
        const [count, increment] = hook()
        return (
          <div>
            <div className='count'>{count}</div>
            <button className='increment' onClick={increment} />
          </div>
        )
      }
    }

    it('should call actions with non selector', () => {
      const { subscriber } = CounterStore
      expect(subscriber.hasListen).toBe(false)

      const Component = withHook(createHook(CounterStore))
      const { container } = render(<Component />)
      const count = container.querySelector('.count')
      const increment = container.querySelector('.increment') as Element

      expect(subscriber.hasListen).toBe(true)
      subscriber.value = 0

      expect(count).toHaveTextContent('0')
      fireEvent.click(increment)
      expect(count).toHaveTextContent('1')
      fireEvent.click(increment)
      expect(count).toHaveTextContent('2')
    })

    it('should call actions with selector', () => {
      const Component = withHook(
        createHook(CounterStore, (num) => Math.min(2, num))
      )
      CounterStore.subscriber.value = 0
      const { container } = render(<Component />)
      const count = container.querySelector('.count')

      expect(count).toHaveTextContent('0')
      const increment = container.querySelector('.increment') as Element
      fireEvent.click(increment)
      fireEvent.click(increment)
      expect(count).toHaveTextContent('2')
      fireEvent.click(increment)
      fireEvent.click(increment)
      expect(count).toHaveTextContent('2')
    })

    it('should new instance with contaner', () => {
      const Component = withHook(createHook(CounterStore))
      const Container = createContainer(CounterStore)
      const { container } = render(
        <Container value={10}>
          <Component />
        </Container>
      )
      CounterStore.subscriber.value = 0
      const count = container.querySelector('.count')

      expect(count).toHaveTextContent('10')
      const increment = container.querySelector('.increment') as Element
      fireEvent.click(increment)
      fireEvent.click(increment)
      expect(count).toHaveTextContent('12')
    })
  })
  describe('Shalow action', () => {
    const Store = createStore({
      state: { a: false, b: false },
      action: shallowAction(({ setState }) => {
        return {
          toggleA: () => setState(({ a }) => ({ a: !a })),
          toggleB: () => setState(({ b }) => ({ b: !b })),
          reset: () => {
            setState({ a: false, b: false })
          }
        }
      })
    })

    const useStore = createHook(Store)

    let countRener = 0

    function Component() {
      const [{ a, b }, { toggleA, toggleB, reset }] = useStore()
      countRener++

      return (
        <div>
          <button className='a' onClick={toggleA}>
            {`${a}`}
          </button>
          <button className='b' onClick={toggleB}>
            {`${b}`}
          </button>

          <button className='reset' onClick={reset}>
            {`${b}`}
          </button>
        </div>
      )
    }

    it('should action work inline', () => {
      const { container } = render(<Component />)
      const btnA = container.querySelector('.a') as Element
      const btnB = container.querySelector('.b') as Element
      const btnReset = container.querySelector('.reset') as Element

      expect(btnA).toHaveTextContent('false')
      expect(btnB).toHaveTextContent('false')
      expect(countRener).toBe(1)

      fireEvent.click(btnA)
      expect(btnA).toHaveTextContent('true')
      expect(btnB).toHaveTextContent('false')
      expect(countRener).toBe(2)

      fireEvent.click(btnB)
      expect(btnA).toHaveTextContent('true')
      expect(btnB).toHaveTextContent('true')
      expect(countRener).toBe(3)

      fireEvent.click(btnReset)
      expect(btnA).toHaveTextContent('false')
      expect(btnB).toHaveTextContent('false')
      expect(countRener).toBe(4)

      fireEvent.click(btnReset)
      expect(btnA).toHaveTextContent('false')
      expect(btnB).toHaveTextContent('false')
      expect(countRener).toBe(4)
    })
  })
})
