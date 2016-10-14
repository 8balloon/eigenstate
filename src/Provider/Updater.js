import assert from '../validation/assert'

export default function Updater(executeUpdate, optionalOnInvoke) {

  optionalOnInvoke && assert.onInvokeIsFunction(optionalOnInvoke)
  const onInvoke = optionalOnInvoke || (() => {})

  var effects = []
  const enqueueEffect = (effect) => effects.push(effect)
  const executeEffects = () => {

    const effectsInExecution = effects
    effects = []

    effectsInExecution.forEach(effect => effect())
  }

  var cbIntervalId = null
  const acknowledgeInvocation = (invocation) => {

    onInvoke(invocation)

    clearInterval(cbIntervalId)
    cbIntervalId = setInterval(() => {

      clearInterval(cbIntervalId)
      executeUpdate(executeEffects)

    }, 0)
  }

  return { enqueueEffect, acknowledgeInvocation }
}
