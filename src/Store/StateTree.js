import Immutable from 'seamless-immutable'
import { mapObjectTreeLeaves, getValueByPath } from '../utils'
import assert from '../validation/assert'
import validMethod from '../validation/validMethod'
import Batcher from './Batcher'

export default function StateTree(stateDef, executeUpdate, onInvoke) {

  const batcher = Batcher(executeUpdate, onInvoke)

  var stateTree = Immutable(mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArg) {

      assert.noSecondArgumentWasPassed(illegalSecondArg, key, path)

      const localStateTree = getValueByPath(stateTree, path)
      const methodReturnValue = validMethod(method, payload, localStateTree, key, path)

      var nextLocalState = null

      if (methodReturnValue) {

        if (methodReturnValue instanceof Function) { // isEffect

          batcher.enqueueEffect(methodReturnValue)
        }
        else { // isData

          assert.returnDataFitsStateDef(methodReturnValue, localStateDef, key, path)

          nextLocalState = localStateTree.merge(methodReturnValue)

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
        localState: localStateTree,
        nextLocalState: nextLocalState || localStateTree
      })
    }
  }))

  return stateTree
}
