import { Provider } from '../../src'

const afterEffectsStateDef = {
  count: 0,
  increment: (_, state) => ({count: state.count + 1}),
  setAfterEffect: (_, state) => {
    document.getElementById('afterEffect').innerHTML = state.count
  },
  afterEffect: (_, state) => {
    state.increment()
    return state.setAfterEffect
  }
}

const AfterEffectsView = (props) => (
  <div id="afterEffectsTest">
    <div onClick={props.afterEffect}>INCREMENT WITH AFTEREFFECTS</div>
    {props.count}
    <div id="afterEffect" />
  </div>
)

export default function AfterEffectsTest(props) {

  return (
    <Provider stateDef={afterEffectsStateDef}>
      <AfterEffectsView />
    </Provider>
  )
}
