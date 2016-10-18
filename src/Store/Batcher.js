import assert from '../validation/assert'

export default function Batcher(executeUpdate, onInvoke) {

  var cbIntervalId = null
  var effects = []

  let invokeEffects = () => {

    const effectsInExecution = effects
    effects = []

    effectsInExecution.forEach((effect) => {

      const effectReturn = effect()
      assert.effectReturnsUndefined(effectReturn, effect)
    })
  }
  const executeUpdateWithEffects = (nextState) => {

    clearInterval(cbIntervalId)
    cbIntervalId = setInterval(() => {

      clearInterval(cbIntervalId)
      executeUpdate(nextState, invokeEffects)
    }, 0)
  }

  const enqueueEffect = (effect) => effects.push(effect)

  return {
    executeUpdate: executeUpdateWithEffects,
    handleInvocation: onInvoke,
    enqueueEffect
  }
}
