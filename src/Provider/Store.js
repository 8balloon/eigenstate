import { graftState } from '../utils'
import Eigenstate from './Eigenstate'

export default function Store({stateDef, onAction, onUpdate}, onUpdateMiddleware) {

  var eigenstate = null
    , cbIntervalID = null
    // , updatesBatched = 0

  const noop = () => {}
  const callOnUpdateWithState = onUpdate === undefined ? noop : () => onUpdate(eigenstate)
  const callOnUpdate = () => onUpdateMiddleware(callOnUpdateWithState)

  const getState = () => eigenstate
  const setState = (state, callerCallback) => {

    eigenstate = state

    cbIntervalID && clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      callOnUpdate()

      clearInterval(cbIntervalID)
      cbIntervalID = null
      // console.log("!!!UPDATES BATCHED:", updatesBatched)
      // updatesBatched = 0
    }, 0)
    // updatesBatched++
  }

  const updateStateDef = (newStateDef) => {

    const lastEigenstate = eigenstate
    eigenstate = Eigenstate(newStateDef, onAction, setState)
    graftState(eigenstate, lastEigenstate)
  }

  const store = {
    getState,
    setState,
    updateStateDef
  }

  eigenstate = Eigenstate(stateDef, onAction, setState)

  return store
}
