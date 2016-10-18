import assert from '../validation/assert'

export default function Batcher(updateCallback) {

  var effectQueue = []

  const triggerEffects = () => {

    const effectsInExecution = effectQueue
    effectQueue = []

    effectsInExecution.forEach((effect) => {

      const effectReturn = effect()
      assert.effectReturnsUndefined(effectReturn, effect)
    })
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
