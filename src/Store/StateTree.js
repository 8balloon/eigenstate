import Immutable from 'seamless-immutable'
import { mapObjectTreeLeaves, getValueByPath } from '../utils'
import assert from '../validation/assert'
import validMethod from '../validation/validMethod'

export default function StateTree(stateDef, executor) {

  let stateTree = Immutable(mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArg) {

      assert.noSecondArgumentWasPassed(illegalSecondArg, key, path)

      const localStateTree = getValueByPath(stateTree, path)
      const methodReturnValue = validMethod(method, payload, localStateTree, key, path)

      let nextLocalState = null

      if (methodReturnValue) {

        if (methodReturnValue instanceof Function) { // isEffect

          executor.enqueueEffect(methodReturnValue)
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

      executor.handleInvocation(stateTree, {
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
