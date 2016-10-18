export default function Batcher(executeUpdate, onInvoke) {

  var cbIntervalId = null
  var effects = []

  let invokeEffects = () => {

    const effectsInExecution = effects
    effects = []
    effectsInExecution.forEach(effect => effect())
  }

  const handleInvocation = (nextState, invocationDetails) => {

    onInvoke(invocationDetails)

    clearInterval(cbIntervalId)
    cbIntervalId = setInterval(() => {

      clearInterval(cbIntervalId)
      executeUpdate(nextState, invokeEffects)

    }, 0)
  }

  const enqueueEffect = (effect) => effects.push(effect)

  return { handleInvocation, enqueueEffect }
}
