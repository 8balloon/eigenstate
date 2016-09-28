import { Provider } from '../../src'

/*
Your application's state definition.
This state definition has 1 value and 1 method.
*/
const CounterStateDef = {
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount })
}

/*
Your application's view component.
When used as a child of the Eigenstate Provider, it will have access to your state values and methos via "props"
*/
const CounterView = (props) => (
  <div className="simpleCounter" style={{backgroundColor: 'orange'}}>
    <div className="count">{ props.count }</div>
    <div className="incrementer" onClick={() => props.increment(1)}> INCREMENT </div>
  </div>
)

/*
Eigenstate's Provider creates your state object for you.
It passes access to your state methods and values via "props"
*/
export default function SimpleCounter() {
  return (
    <Provider stateDef={CounterStateDef}>
      <CounterView />
    </Provider>
  )
}
