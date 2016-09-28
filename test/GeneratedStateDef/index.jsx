import { Provider } from '../../src'

var incAmount = 1

function nextCounterStateDef() {

  const thisIncAmount = incAmount
  incAmount++

  return {
    count: {
      number: 0
    },
    increment: (_, state) => {
      return { count: { number: state.count.number + thisIncAmount } }
    }
  }
}

const CounterView = (props) => (
  <div className="simpleCounter">
    <div className="count">{ props.count.number }</div>
    <div className="incrementer" onClick={props.increment}> INCREMENT </div>
  </div>
)

function SimpleCounter(props) {
  return (
    <Provider stateDef={props.counterStateDef}>
      <CounterView />
    </Provider>
  )
}

const controllerStateDef = {
  x: 0,
  rerender: (_, state) => ({x: state.x + 1})
}

const Controller = (props) => (
  <div className="controller">
    <SimpleCounter counterStateDef={nextCounterStateDef()} />
    <div onClick={props.rerender}> RE RENDER </div>
  </div>
)

export default function CounterController() {
  return (
    <Provider stateDef={controllerStateDef}>
      <Controller />
    </Provider>
  )
}
