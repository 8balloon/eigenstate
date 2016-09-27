import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'

export default function Eigenstate({stateDef, onAction}, setState) {

  assert.stateDefIsObject(stateDef)
  onAction && assert.onActionPropIsFunction(onAction)

  var latestInvocationID = 0
  var setStateTimeout = undefined

  var eigenstate = mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArgument) {

      assert.methodWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      const localState = getValueByPath(eigenstate, path)

      const thisInvocationID = latestInvocationID + 1
      latestInvocationID = thisInvocationID

      const localMethodReturn = method(payload, localState)

      var nextLocalState = undefined

      if (localMethodReturn !== undefined) { //this method is a synchronous operation

        assert.operationCompletedSynchronously(thisInvocationID, latestInvocationID, key, path)
        assert.methodReturnFitsStateDef(localMethodReturn, localStateDef, key, path)

        nextLocalState = objectAssign({}, localState, localMethodReturn)

        eigenstate = mutSetValueByPath(eigenstate, path, nextLocalState)

        setState(eigenstate)
      }

      onAction && onAction({
        methodKey: key,
        methodPath: path,
        payload,
        returnValue: localMethodReturn,
        previousLocalState: localState,
        localState: nextLocalState || localState,
        state: eigenstate
      })
    }
  })

  return eigenstate
}
