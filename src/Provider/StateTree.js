import Immutable from 'seamless-immutable'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import assert from '../validation/assert'
import Batcher from './Batcher'

export default function StateTree(stateDef, executeUpdate, optionalOnInvoke) {

  const batcher = Batcher(executeUpdate, optionalOnInvoke)

  var lastInvocationId = 0

  var stateTree = Immutable(mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

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

          batcher.enqueueEffect(methodReturnValue)
        }
        else {

          assert.dataReturnerDidNotInvokeMethod(thisInvocationID, lastInvocationId, key, path)
          assert.returnDataFitsStateDef(methodReturnValue, localStateDef, key, path)

          nextLocalState = Object.assign({}, localState, methodReturnValue)

          if (path.length === 0) {
            stateTree = stateTree.merge(nextLocalState)
          }
          else {
            stateTree = stateTree.setIn(path, nextLocalState)
          }
        }
      }

      batcher.handleInvocation(stateTree, {
        methodKey: key,
        methodPath: path,
        payload,
        returnValue: methodReturnValue,
        localState: localState,
        nextLocalState: nextLocalState || localState
      })
    }
  }))

  return stateTree
}
