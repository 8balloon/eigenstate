import assert from '../validation/assert'

export default function Batcher(updateCallback) {

  var effectQueue = []
  var effectsTimeout = 0

  const triggerEffects = () => {

    clearTimeout(effectsTimeout)
    effectsTimeout = setTimeout(() => {
      const effectsInExecution = effectQueue
      effectQueue = []

      effectsInExecution.forEach((effect) => {

        const effectReturn = effect()
        assert.effectReturnsUndefined(effectReturn, effect)
      })
    }, 0)
  }

  const passUpdateWithEffectTrigger = (nextState, invocationDetails) => {
    updateCallback(nextState, invocationDetails, triggerEffects)
  }

  const enqueueEffect = (effect) => effectQueue.push(effect)

  return {
    handleInvocation: passUpdateWithEffectTrigger,
    enqueueEffect
  }
}
