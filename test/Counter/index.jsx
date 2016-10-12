import { Provider, logVerbosely } from '../../src'

/*
Your application's state definition.
This state definition has 1 value and 1 method.
*/
export const counterState = {
  count: 0,
  color: 'red',
  increment: (amount, state) => ({ count: state.count + amount }),
  delayedIncrement: (payload, state) => {
    2
    const { amount, delay } = payload
    setTimeout(() => state.increment(amount), delay)
  },
  changeColor: (_, state) => ({ color: state.color === 'red' ? 'blue' : 'red' })
}

/*
*/
export const CounterView = (props) => (
  <div id="counter" style={{backgroundColor: props.color}}>
    { props.count }
    <div onClick={() => props.increment(1)}> INCREMENT </div>
    <div onClick={() => props.delayedIncrement({ amount: 10, delay: 1000 })}>
      DELAYED INCREMENT
    </div>
    <div onClick={props.changeColor}> CHANGE COLOR </div>
  </div>
)

/*
Eigenstate's Provider creates your state object for you.
It passes access to your state methods and values via "props"
*/
export default function Counter() {
  return (
    <Provider stateDef={counterState} onInvoke={logVerbosely}>
      <CounterView />
    </Provider>
  )
}
