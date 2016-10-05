import { graftState } from '../utils'
import Eigenstate from './Eigenstate'

export default function Store({stateDef, onUpdate}, callAfterUpdate) {

  var eigenstate = null
  var changes = []
  var effects = []


  let noop = () => {}
  let callOnUpdateWithChanges = onUpdate === undefined ? noop : () => {

    onUpdate(changes)
    changes = []

    var effectsInExecution = effects
    effects = []

    effectsInExecution.forEach(effect => effect())
  }
  const callOnUpdate = () => callAfterUpdate(callOnUpdateWithChanges)


  var cbIntervalID = null
  const setState = (state, callerCallback) => {

    eigenstate = state

    clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      clearInterval(cbIntervalID)
      callOnUpdate()

    }, 0)
  }


  const recordChange = (change) => changes.push(change)

  const enqueueEffect = (effect) => effects.push(effect)


  const updateStateDef = (newStateDef) => {

    let lastEigenstate = eigenstate
    eigenstate = Eigenstate({
      stateDef: newStateDef,
      setState,
      recordChange,
      enqueueEffect
    })
    graftState(eigenstate, lastEigenstate)
  }

  eigenstate = Eigenstate({stateDef, setState, recordChange, enqueueEffect})

  return {
    getState: () => eigenstate,
    setState,
    updateStateDef
  }
}
