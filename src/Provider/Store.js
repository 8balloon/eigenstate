import { graftState } from '../utils'
import Eigenstate from './Eigenstate'

export default function Store({stateDef, onAction, onUpdate}, onUpdateMiddleware) {

  var eigenstate = null
  var actionCache = []


  const callOnAction = onUpdate === undefined ? onAction :
    (action) => {
      actionCache.push(action)
      onAction(action)
    }


  let noop = () => {}
  let callOnUpdateWithParams = onUpdate === undefined ? noop : () => {
    onUpdate(eigenstate, actionCache)
    actionCache = []
  }
  const callOnUpdate = () => onUpdateMiddleware(callOnUpdateWithParams)



  var cbIntervalID = null
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

    let lastEigenstate = eigenstate
    eigenstate = Eigenstate(newStateDef, onAction, setState)
    graftState(eigenstate, lastEigenstate)
  }


  eigenstate = Eigenstate(stateDef, callOnAction, setState)

  return {
    getState: () => eigenstate,
    setState,
    updateStateDef
  }
}
