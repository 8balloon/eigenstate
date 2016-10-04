import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'
import getMethodReturn from './getMethodReturn'

export default function Eigenstate({stateDef, setState, recordChange, enqueueAfterEffect} ) {

  assert.stateDefIsObject(stateDef)

  var latestInvocationID = 0
  var setStateTimeout = null

  var eigenstate = mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArgument) {

      assert.methodWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      const localState = getValueByPath(eigenstate, path)

      const thisInvocationID = latestInvocationID + 1
      latestInvocationID = thisInvocationID

      const localMethodReturn = getMethodReturn(method, payload, localState, key, path)

      var nextLocalState = undefined

      if (localMethodReturn) {

        if (localMethodReturn instanceof Function) {

          enqueueAfterEffect(localMethodReturn)
        }
        else {

          assert.operationCompletedSynchronously(thisInvocationID, latestInvocationID, key, path)
          assert.returnValueFitsStateDef(localMethodReturn, localStateDef, key, path)

          nextLocalState = Object.assign({}, localState, localMethodReturn)

          eigenstate = mutSetValueByPath(eigenstate, path, nextLocalState)

          setState(eigenstate)
        }
      }

      recordChange({
        methodKey: key,
        methodPath: path,
        payload,
        returnValue: localMethodReturn,
        localState: localState,
        nextLocalState: nextLocalState || localState
      })
    }
  })

  return eigenstate
}
