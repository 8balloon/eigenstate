import Eigenstate from './Eigenstate'

export default function Store({stateDef, onAction}, onSetStateCallback) {

  var eigenstate = null
    , cbIntervalID = null
    // , updatesBatched = 0

  const getState = () => eigenstate
  const setState = (state, callerCallback) => {

    eigenstate = state

    cbIntervalID && clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      // The onSetStateCallback is expected to call the callerCallback
      onSetStateCallback && onSetStateCallback(callerCallback)

      clearInterval(cbIntervalID)
      cbIntervalID = null
      // console.log("!!!UPDATES BATCHED:", updatesBatched)
      // updatesBatched = 0
    }, 0)
    // updatesBatched++
  }

  const store = {
    getState,
    setState
  }

  eigenstate = Eigenstate(stateDef, onAction, setState)

  return store
}
