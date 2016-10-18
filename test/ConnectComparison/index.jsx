import { Provider, Store, connect } from '../../src'

const counterStore = Store({
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount })
})

const CounterView = (props) => (
  <div className="counter">
    <div className="count">{ props.count }</div>
    <div className="incrementer" onClick={() => props.increment(1)}> INCREMENT </div>
  </div>
)

const ConnectedCounterView = connect(CounterView)

const CountersWrapper = (props) => (
  <div className="connectCounterCompare" style={{backgroundColor: 'orange'}}>
    <CounterView {...props} />
    <ConnectedCounterView />
  </div>
)

export default function ConnectComparison() {
  return (
    <Provider store={counterStore}>
      <CountersWrapper />
    </Provider>
  )
}
