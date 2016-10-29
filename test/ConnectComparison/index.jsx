import { Provider, Store, connect } from '../../src'

const counterStore = Store({
  count: 0,
  increment: (amount, state) => ({ count: state.count + amount }),
  doNothing: () => {}
})

const CounterView = (props) => { return (
  <div className="counter">
    <div className="count">{ props.count }</div>
    <div className="incrementer" onClick={() => props.increment(1)}> INCREMENT </div>
  </div>
)}

const ConnectedCounterView = connect(CounterView)

// const OptimizedCounterView = connect(CounterView, {
//   count: React.PropTypes.number.isRequired,
//   increment: React.PropTypes.func.isRequired
// })
//
// console.log("PROPTYPES:", React.PropTypes)
// window.PropTypes = React.PropTypes

const CountersWrapper = (props) => (
  <div className="connectCounterCompare" style={{backgroundColor: 'orange'}}>
    <CounterView {...props} />
    <ConnectedCounterView />
    <div onClick={props.doNothing}>Render Check</div>
  </div>
)

export default function ConnectComparison() {
  return (
    <Provider store={counterStore}>
      <CountersWrapper />
    </Provider>
  )
}
