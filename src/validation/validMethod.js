import Immutable from 'seamless-immutable'
import { mapObjectValues, isProduction } from '../utils'
import { dataReturnerInvokedOtherMethod } from './errorMessages'

// enforces pure XOR impure
export default function validMethod(method, payload, stateTree, key) {

  if (isProduction) return method(payload, stateTree)

  let invokedOtherMethod = false
  let shouldBePure = false

  const enforcingStateTree = Immutable(mapObjectValues(stateTree, (property) => {

    if (!(property instanceof Function)) return property
    const method = property

    return (payload, illegalSecondArg) => {
      if (shouldBePure) {
        throw new Error(dataReturnerInvokedOtherMethod(key))
      }
      invokedOtherMethod = true
      return method(payload, illegalSecondArg)
    }
  }))

  const methodReturnValue = method(payload, enforcingStateTree)

  if (methodReturnValue && (!(methodReturnValue instanceof Function))) { //Effects OK
    if (invokedOtherMethod) {
      throw new Error(dataReturnerInvokedOtherMethod(key))
    }
    shouldBePure = true
  }

  return methodReturnValue
}
