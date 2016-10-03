import { graftState } from '../utils'
import Eigenstate from './Eigenstate'

export default function Store({stateDef, onAction, onUpdate}, callAfterUpdate) {

  var eigenstate = null
  var actionCache = []
  var afterEffects = []


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
  const callOnUpdate = () => callAfterUpdate(callOnUpdateWithParams)



  var cbIntervalID = null
  const setState = (state, callerCallback) => {

    eigenstate = state

    cbIntervalID && clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      callOnUpdate()

      afterEffects.forEach(afterEffect => afterEffect())
      afterEffects = []

      clearInterval(cbIntervalID)
      cbIntervalID = null
    }, 0)
  }


  const enqueueAfterEffect = (afterEffect) => afterEffects.push(afterEffect)


  const updateStateDef = (newStateDef) => {

    let lastEigenstate = eigenstate
    eigenstate = Eigenstate(newStateDef, onAction, setState, enqueueAfterEffect)
    graftState(eigenstate, lastEigenstate)
  }


  eigenstate = Eigenstate(stateDef, callOnAction, setState, enqueueAfterEffect)

  return {
    getState: () => eigenstate,
    setState,
    updateStateDef
  }
}
