import Immutable from 'seamless-immutable'
import { mapObjectValues } from '../utils'
import assert from '../validation/assert'
import validMethod from '../validation/validMethod'

export default function StateTree(stateDef, executor) {

  let stateTree = Immutable(mapObjectValues(stateDef, (property, key) => {

    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArg) {

      assert.noSecondArgumentWasPassed(illegalSecondArg, key)

      const state = stateTree
      const methodReturnValue = validMethod(method, payload, stateTree, key)

      if (methodReturnValue) {

        if (methodReturnValue instanceof Function) { // isEffect

          executor.enqueueEffect(methodReturnValue)
        }
        else { // isData

          assert.returnDataFitsStateDef(methodReturnValue, stateDef, key)

          stateTree = stateTree.merge(methodReturnValue)
        }
      }

      executor.handleInvocation(stateTree, {
        methodKey: key,
        payload,
        returnValue: methodReturnValue,
        state,
        nextState: stateTree
      })
    }
  }))

  return stateTree
}
