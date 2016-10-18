import assert from '../validation/assert'

export default function Batcher(executeUpdate, onInvoke) {

  var cbIntervalId = null
  var effects = []

  let invokeEffect = (effect) => { //recursive

    var effectReturn = effect()
    if (effectReturn !== undefined) {

      assert.effectReturnIsFunction(effectReturn, effect)
      invokeEffect(effectReturn)
    }
  }
  let invokeEffects = () => {

    const effectsInExecution = effects
    effects = []

    effectsInExecution.forEach(invokeEffect)
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
