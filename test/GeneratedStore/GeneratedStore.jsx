import { Store, connect } from '../../src'

var incAmount = 1

function nextCounterStateDef() {

  const thisIncAmount = incAmount
  incAmount++

  return {
    generatedCount: {
      number: 0
    },
    increment: (_, state) => {
      return { generatedCount: { number: state.generatedCount.number + thisIncAmount } }
    }
  }
}

const CounterView = (props) => {console.log("SIMPLECOUNTERPRPOS:", props); return (
  <div className="simpleCounter">
    <div className="generatedCount">{ props.generatedCount.number }</div>
    <div className="incrementer" onClick={props.increment}> INCREMENT </div>
  </div>
)}

function SimpleCounter(props) {

  return React.createElement(connect(CounterView, props.store))
}

const controllerStore = Store({
  x: 0,
  rerender: (_, state) => ({x: state.x + 1})
})

const Controller = (props) => {
  const generatedStore = Store(nextCounterStateDef())
  return React.createElement(connect(() => (
    <div className="controller" style={{backgroundColor: 'orange'}}>
      <SimpleCounter store={generatedStore} />
      <div onClick={props.rerender}> RE RENDER </div>
    </div>
  ), generatedStore))
}

export default connect(Controller, controllerStore)
