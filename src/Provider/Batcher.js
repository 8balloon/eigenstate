import assert from '../validation/assert'

export default function Batcher(executeUpdate, optionalOnInvoke) {

  optionalOnInvoke && assert.onInvokeIsFunction(optionalOnInvoke)
  const onInvoke = optionalOnInvoke || (() => {})

  var cbIntervalId = null
  var effects = []

  let executeEffects = () => {

    const effectsInExecution = effects
    effects = []
    effectsInExecution.forEach(effect => effect())
  }

  const handleInvocation = (nextState, invocationDetails) => {

    onInvoke(invocationDetails)

    clearInterval(cbIntervalId)
    cbIntervalId = setInterval(() => {

      clearInterval(cbIntervalId)
      executeUpdate(nextState, executeEffects)

    }, 0)
  }

  const enqueueEffect = (effect) => effects.push(effect)

  return { handleInvocation, enqueueEffect }
}
