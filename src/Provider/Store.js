import Eigenstate from './Eigenstate'

export default function Store({stateDef, onAction, onUpdate}, onUpdateCallback) {

  var eigenstate = null
    , cbIntervalID = null
    // , updatesBatched = 0

  const noop = () => {}
  const callOnUpdateWithState = !onUpdate ? noop : () => onUpdate(eigenstate)

  const getState = () => eigenstate
  const setState = (state, callerCallback) => {

    eigenstate = state

    cbIntervalID && clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      onUpdateCallback(callOnUpdateWithState)

      clearInterval(cbIntervalID)
      cbIntervalID = null
      // console.log("!!!UPDATES BATCHED:", updatesBatched)
      // updatesBatched = 0
    }, 0)
    // updatesBatched++
  }

  const updateStateDef = (newStateDef) => {
    eigenstate = Eigenstate(newStateDef, onAction, setState)
  }

  const store = {
    getState,
    setState,
    updateStateDef
  }

  eigenstate = Eigenstate(stateDef, onAction, setState)

  return store
}
