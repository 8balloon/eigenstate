import assert from '../validation/assert'

export default function Batcher(executeUpdate) {

  var effects = []

  let invokeEffects = () => {

    const effectsInExecution = effects
    effects = []

    effectsInExecution.forEach((effect) => {

      const effectReturn = effect()
      assert.effectReturnsUndefined(effectReturn, effect)
    })
  }
  const executeUpdateWithEffects = (nextState, invocationDetails) => {
    executeUpdate(nextState, invocationDetails, invokeEffects)
  }

  const enqueueEffect = (effect) => effects.push(effect)

  return {
    handleInvocation: executeUpdateWithEffects,
    enqueueEffect
  }
}
