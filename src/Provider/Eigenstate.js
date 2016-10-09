import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import assert from '../validation/assert'

export default function Eigenstate(stateDef, executeUpdate, optionalOnInvoke) {

  optionalOnInvoke && assert.onInvokeIsFunction(optionalOnInvoke)
  const onInvoke = optionalOnInvoke || (() => {})

  var effects = []
  const enqueueEffect = (effect) => effects.push(effect)
  const executeEffects = () => {

    const effectsInExecution = effects
    effects = []

    effectsInExecution.forEach(effect => effect())
  }

  var cbIntervalID = null
  const acknowledgeInvocation = (invocation) => {

    onInvoke(invocation)

    clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      clearInterval(cbIntervalID)
      executeUpdate(executeEffects)

    }, 0)
  }

  var latestInvocationID = 0

  var eigenstate = mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArgument) {

      assert.methodWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      const localState = getValueByPath(eigenstate, path)

      const thisInvocationID = latestInvocationID + 1
      latestInvocationID = thisInvocationID

      const methodReturnValue = method(payload, localState)

      var nextLocalState = null

      if (methodReturnValue) {

        if (methodReturnValue instanceof Function) { // isEffect

          enqueueEffect(methodReturnValue)
        }
        else {

          assert.dataReturnerDidNotInvokeMethod(thisInvocationID, latestInvocationID, key, path)
          assert.returnDataFitsStateDef(methodReturnValue, localStateDef, key, path)

          nextLocalState = Object.assign({}, localState, methodReturnValue)

          Object.assign(eigenstate, mutSetValueByPath(eigenstate, path, nextLocalState))
        }
      }

      acknowledgeInvocation({
        methodKey: key,
        methodPath: path,
        payload,
        returnValue: methodReturnValue,
        localState: localState,
        nextLocalState: nextLocalState || localState
      })
    }
  })

  return eigenstate
}
