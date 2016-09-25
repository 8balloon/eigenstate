import { Provider } from '../../src'

const stateDef = {

  //values
  count: 0,
  numCounters: 1,

  //synchronous methods
  incrementCount: (amount, state) => ({count: state.count + amount}),
  addCounter: (_, state) => ({numCounters: state.numCounters + 1}),
  removeCounter: (_, state) => {
    if (state.numCounters > 0) {
      return { numCounters: state.numCounters - 1 }
    }
  },

  //asynchronous method
  delayedIncrement: (payload, state) => {
    const { incrementAmount, delayMS } = payload
    setTimeout(() => {
      state.incrementCount(incrementAmount)
    }, delayMS)
  }
}

const Counters = (props) => (
  <div id="counter-app">
    <div id="counters">
      {(function() {
        var counters = []
        for (var i = 0; i < props.numCounters; i++) {
          counters.push(
            <div className="counter">
              { props.count }
            </div>
          )
        }
        return counters
      })()}
    </div>
    <div id="counter-controllers">
      <div onClick={props.addCounter}> add a counter </div>
      <div onClick={props.removeCounter}> remove a counter </div>
      <div onClick={() => props.incrementCount(5)}> small, fast increment </div>
      <div onClick={() => props.delayedIncrement({
        incrementAmount: 20,
        delayMS: 1000
      })}>
        big, slow increment
      </div>
    </div>
  </div>
)

export default function CountersApp(props) {
  return (
    <Provider stateDef={stateDef}>
      <Counters />
    </Provider>
  )
}
