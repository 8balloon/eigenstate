import { Store, Provider } from '../../src'

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

const controllerStore = Store({
  x: 0,
  rerender: (_, state) => ({x: state.x + 1})
})

const Controller = (props) => {
  const generatedStore = Store(nextCounterStateDef())
  return  <div className="controller" style={{backgroundColor: 'orange'}}>
    <Provider store={generatedStore}>
      <CounterView />
    </Provider>
    <div onClick={props.rerender}> RE RENDER </div>
  </div>
}

export default () => <Provider store={controllerStore}>
  <Controller />
</Provider>
