import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import assert from '../validation/assert'

export default function StateTree(stateDef, updater) {

  var eigenstate = mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArgument) {

      assert.noSecondArgumentWasPassed(illegalSecondArgument, key, path)

      const localState = getValueByPath(eigenstate, path)

      const methodReturnValue = method(payload, localState)

      var nextLocalState = null

      if (methodReturnValue) {

        if (methodReturnValue instanceof Function) { // isEffect

          updater.enqueueEffect(methodReturnValue)
        }
        else {

          assert.returnDataFitsStateDef(methodReturnValue, localStateDef, key, path)

          nextLocalState = Object.assign({}, localState, methodReturnValue)

          Object.assign(eigenstate, mutSetValueByPath(eigenstate, path, nextLocalState))
        }
      }

      updater.acknowledgeInvocation({
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
