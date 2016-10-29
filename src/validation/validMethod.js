import Immutable from 'seamless-immutable'
import { mapObjectTreeLeaves, isProduction } from '../utils'
import { dataReturnerInvokedOtherMethod } from './errorMessages'

// enforces pure XOR impure
export default function validMethod(method, payload, stateTree, key, path) {

  if (isProduction) return method(payload, stateTree)

  let invokedOtherMethod = false
  let shouldBePure = false

  const enforcingStateTree = Immutable(mapObjectTreeLeaves(stateTree, (localProperty) => {

    if (!(localProperty instanceof Function)) return localProperty
    const localMethod = localProperty

    return (localPayload, illegalSecondArg) => {
      if (shouldBePure) {
        throw new Error(dataReturnerInvokedOtherMethod(key, path))
      }
      invokedOtherMethod = true
      return localMethod(localPayload, illegalSecondArg)
    }
  }))

  const methodReturnValue = method(payload, enforcingStateTree)

  if (methodReturnValue && (!(methodReturnValue instanceof Function))) { //Effects OK
    if (invokedOtherMethod) {
      throw new Error(dataReturnerInvokedOtherMethod(key, path))
    }
    shouldBePure = true
  }

  return methodReturnValue
}
