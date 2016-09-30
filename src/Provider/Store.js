import { graftState } from '../utils'
import Eigenstate from './Eigenstate'

export default function Store({stateDef, onAction, onUpdate}, onUpdateMiddleware) {

  var eigenstate = null
    , cbIntervalID = null
    , actionCache = []

  const callOnAction = (action) => {
    actionCache.push(action)
    onAction(action)
  }

  const noop = () => {}
  const callOnUpdateWithState = onUpdate === undefined ? noop : () => {
    onUpdate(eigenstate, actionCache)
    actionCache = []
  }
  const callOnUpdate = () => onUpdateMiddleware(callOnUpdateWithState)

  const getState = () => eigenstate
  const setState = (state, callerCallback) => {

    eigenstate = state

    cbIntervalID && clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      callOnUpdate()

      clearInterval(cbIntervalID)
      cbIntervalID = null
    }, 0)
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

  eigenstate = Eigenstate(stateDef, callOnAction, setState)

  return store
}
