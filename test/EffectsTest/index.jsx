import { Provider, Store } from '../../src'

const effectsTestStore = Store({
  count: 0,
  increment: (_, state) => ({count: state.count + 1}),
  sideEffect1: (_, state) => {
    document.getElementById('effect1').innerHTML = state.count
  },
  effect1: (_, state) => {
    state.increment()
    return state.sideEffect1
  },
  effectWithStateBeforeLastIncrement: (_, state) => {
    state.increment()
    return () => {
      document.getElementById('effect2').innerHTML = state.count
    }
  },
  callEffects: (_, state) => {

    state.effect1()
    state.effectWithStateBeforeLastIncrement()
  }
})

const EffectsView = (props) => { return (
  <div id="effectsTest">
    <div onClick={props.effect1}>INCREMENT WITH EFFECT</div>
    <div onClick={props.callEffects}>EFFECT USING STATE BEFORE LAST INC</div>
    {props.count}
    <div id="effect1" />
    <div id="effect2" />
  </div>
)}

export default function EffectsTest(props) {

  return (
    <Provider store={effectsTestStore}>
      <EffectsView />
    </Provider>
  )
}
