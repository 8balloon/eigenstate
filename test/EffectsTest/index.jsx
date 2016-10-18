import { Provider, Store } from '../../src'

const effectsTestStore = Store({
  count: 0,
  increment: (_, state) => ({count: state.count + 1}),
  setEffect: (_, state) => {
    document.getElementById('effect1').innerHTML = state.count
  },
  effect1: (_, state) => {
    state.increment()
    return state.setEffect
  },
  indirectlyCallEffect: (_, state) => {

    state.effect1()
    return () => {
      document.getElementById("effect2").innerHTML = document.getElementById("effect1").innerHTML
    }
  }
})

const EffectsView = (props) => (
  <div id="effectsTest">
    <div onClick={props.effect1}>INCREMENT WITH effectS</div>
    <div onClick={props.indirectlyCallEffect}>CALL SECONDARY effect</div>
    {props.count}
    <div id="effect1" />
    <div id="effect2" />
  </div>
)

export default function EffectsTest(props) {

  return (
    <Provider store={effectsTestStore}>
      <EffectsView />
    </Provider>
  )
}
