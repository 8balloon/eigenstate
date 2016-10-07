import { graftState } from '../utils'
import Eigenstate from './Eigenstate'

export default function Store(stateDef, executeUpdate) {

  var eigenstate = null
  var changes = []
  var effects = []

  const executeEffects = () => {

    const effectsInExecution = effects
    effects = []

    effectsInExecution.forEach(effect => effect())
  }

  var cbIntervalID = null
  const setState = (state) => {

    eigenstate = state

    clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      clearInterval(cbIntervalID)

      const completedChanges = changes
      changes = []
      executeUpdate(completedChanges, executeEffects)

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
