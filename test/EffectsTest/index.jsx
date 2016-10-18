import { Provider, Store } from '../../src'

const effectsTestStore = Store({
  count: 0,
  increment: (_, state) => ({count: state.count + 1}),
  effect1: (_, state) => {
    state.increment()
    return () => {
      console.log("BANG")
      document.getElementById('effect1').innerHTML = state.count
    }
  },
  effect2: (_, state) => {
    state.increment()
    return () => {
      console.log("BOOM")
      document.getElementById('effect2').innerHTML = state.count
    }
  },
  callEffects: (_, state) => {

    state.effect1()
    state.effect2()
  }
})

const EffectsView = (props) => { console.log("WHIZ"); return (
  <div id="effectsTest">
    <div onClick={props.effect1}>INCREMENT WITH EFFECT</div>
    <div onClick={props.callEffects}>INC W/2 EFFECTS</div>
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
