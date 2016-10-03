import { Provider } from '../../src'

const afterEffectsStateDef = {
  count: 0,
  increment: (_, state) => ({count: state.count + 1}),
  setAfterEffect: (_, state) => {
    document.getElementById('afterEffect1').innerHTML = state.count
  },
  afterEffect1: (_, state) => {
    state.increment()
    return state.setAfterEffect
  },
  indirectlyCallAfterEffect: (_, state) => {

    state.afterEffect1()
    return () => {
      document.getElementById("afterEffect2").innerHTML = document.getElementById("afterEffect1").innerHTML
    }
  }
}

const AfterEffectsView = (props) => (
  <div id="afterEffectsTest">
    <div onClick={props.afterEffect1}>INCREMENT WITH AFTEREFFECTS</div>
    <div onClick={props.indirectlyCallAfterEffect}>CALL SECONDARY AFTEREFFECT</div>
    {props.count}
    <div id="afterEffect1" />
    <div id="afterEffect2" />
  </div>
)

export default function AfterEffectsTest(props) {

  return (
    <Provider stateDef={afterEffectsStateDef}>
      <AfterEffectsView />
    </Provider>
  )
}
