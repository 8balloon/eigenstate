import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'

export default function Eigenstate(props, store) {

  const { stateDef, onAction } = props
  const { getState, setState } = store

  assert.stateDefIsObject(stateDef)
  onAction && assert.onActionPropIsFunction(onAction)

  var latestInvocationID = 0
  var setStateTimeout = undefined

  var eigenstate = mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArgument) {

      assert.methodWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      const contextState = getState()
      const contextStateAtPath = getValueByPath(contextState, path)

      const thisInvocationID = latestInvocationID + 1
      latestInvocationID = thisInvocationID

      const localMethodReturn = method(payload, contextStateAtPath)

      var newLocalState = undefined

      if (localMethodReturn !== undefined) { //this method is a synchronous operation

        assert.operationCompletedSynchronously(thisInvocationID, latestInvocationID, key, path)
        assert.methodReturnFitsStateDef(localMethodReturn, localStateDef, key, path)

        newLocalState = objectAssign({}, contextStateAtPath, localMethodReturn)

        eigenstate = mutSetValueByPath(contextState, path, newLocalState)

        setState(eigenstate)
      }

      onAction && onAction({
        methodKey: key,
        methodPath: path,
        payload,
        returnValue: localMethodReturn,
        previousLocalState: contextStateAtPath,
        localState: newLocalState || contextStateAtPath,
        state: eigenstate
      })
    }
  })

  return eigenstate
}
