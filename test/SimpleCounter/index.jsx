import { Provider } from '../../src'

/*
Your application's state definition.
This state definition has 1 value and 1 method.
*/
const counterStateDef = {
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount }),
  delayedIncrement: (payload, state) => {
    const { amount, delay } = payload
    setTimeout(() => state.increment(amount), delay)
  }
}

/*
Your application's view component.
When used as a child of the Eigenstate Provider, it will have access to your state values and methods via "props"
*/
const CounterView = (props) => (
  <div className="simpleCounter" style={{backgroundColor: 'orange'}}>
    { props.count }
    <div onClick={() => props.increment(1)}> INCREMENT </div>
    <div onClick={() => props.delayedIncrement({ amount: 5, delay: 1000 })}>
      DELAYED INCREMENT
    </div>
  </div>
)

/*
Eigenstate's Provider creates your state object for you.
It passes access to your state methods and values via "props"
*/
export default function SimpleCounter() {
  return (
    <Provider stateDef={counterStateDef}>
      <CounterView />
    </Provider>
  )
}
