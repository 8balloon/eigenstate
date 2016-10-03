import { graftState } from '../utils'
import Eigenstate from './Eigenstate'

export default function Store({stateDef, onUpdate}, callAfterUpdate) {

  var eigenstate = null
  var changes = []
  var afterEffects = []


  let noop = () => {}
  let callOnUpdateWithChanges = onUpdate === undefined ? noop : () => {
    onUpdate(changes)
    changes = []
  }
  const callOnUpdate = () => callAfterUpdate(callOnUpdateWithChanges)


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


  const recordChange = (change) => changes.push(change)

  const enqueueAfterEffect = (afterEffect) => afterEffects.push(afterEffect)


  const updateStateDef = (newStateDef) => {

    let lastEigenstate = eigenstate
    eigenstate = Eigenstate({
      stateDef: newStateDef,
      setState,
      recordChange,
      enqueueAfterEffect
    })
    graftState(eigenstate, lastEigenstate)
  }

  eigenstate = Eigenstate({stateDef, setState, recordChange, enqueueAfterEffect})

  return {
    getState: () => eigenstate,
    setState,
    updateStateDef
  }
}
