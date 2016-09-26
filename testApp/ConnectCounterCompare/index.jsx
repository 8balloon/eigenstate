import { Provider, connect } from '../../src'

const CounterStateDef = {
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount })
}

const CounterView = (props) => (
  <div id="counter">
    <div id="count">{ props.count }</div>
    <div id="incrementer" onClick={() => props.increment(1)}> INCREMENT </div>
  </div>
)

const ConnectedCounterView = connect(CounterView)

const CountersWrapper = (props) => (
  <div id="connectCounterCompare">
    <CounterView {...props} />
    <ConnectedCounterView />
  </div>
)

export default function ConnectCounterCompare() {
  return (
    <Provider stateDef={CounterStateDef}>
      <CounterView />
    </Provider>
  )
}
