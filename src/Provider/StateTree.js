import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import assert from '../validation/assert'

export default function StateTree(stateDef, executeUpdate, optionalOnInvoke) {

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
  const handleInvocatoin = (nextState, invocationDetails) => {

    onInvoke(invocationDetails)

    clearInterval(cbIntervalId)
    cbIntervalId = setInterval(() => {

      clearInterval(cbIntervalId)
      executeUpdate(nextState, executeEffects)

    }, 0)
  }

  var lastInvocationId = 0

  var stateTree = mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArgument) {

      assert.noSecondArgumentWasPassed(illegalSecondArgument, key, path)

      const localState = getValueByPath(stateTree, path)

      const thisInvocationID = lastInvocationId + 1
      lastInvocationId = thisInvocationID

      const methodReturnValue = method(payload, localState)

      var nextLocalState = null

      if (methodReturnValue) {

        if (methodReturnValue instanceof Function) { // isEffect

          enqueueEffect(methodReturnValue)
        }
        else {

          assert.dataReturnerDidNotInvokeMethod(thisInvocationID, lastInvocationId, key, path)
          assert.returnDataFitsStateDef(methodReturnValue, localStateDef, key, path)

          nextLocalState = Object.assign({}, localState, methodReturnValue)

          stateTree = mutSetValueByPath(stateTree, path, nextLocalState)
        }
      }

      handleInvocatoin(stateTree, {
        methodKey: key,
        methodPath: path,
        payload,
        returnValue: methodReturnValue,
        localState: localState,
        nextLocalState: nextLocalState || localState
      })
    }
  })

  return stateTree
}
