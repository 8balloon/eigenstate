import { mapObjectTreeLeaves } from '../utils'
import * as assert from '../validation/assertions'
import {
  pureMethodHadSideEffect,
  impureMethodReturnedValue,
  purityValueInvalid
} from '../validation/errorMessages'

export default function getReturn(method, payload, localState, key, path) {

  const methodID = path.join('.') + '.' + key

  if (method.__purity === undefined) return method(payload, localState)

  if (method.__purity === true) {

    const pureState = mapObjectTreeLeaves(stateDef, (property, localKey, localPath) => {

      if (!(property instanceof Function)) return property

      const sideEffectID = path.join('.') + '.' + localPath.join('.') + '.' + localKey

      const pureErrorer = () => {

        throw new Error(pureMethodHadSideEffect(methodID, sideEffectID))
      }

      return pureErrorer
    })

    return method(payload, pureState)
  }

  if (method.__purity = false) {

    const returnValue = method(payload, eigenstate)

    if ( (returnValue === undefined) || (returnValue instanceof Function) ) {

      return returnValue
    }

    throw new Error(impureMethodReturnedValue(methodID))
  }

  throw new Error(purityValueInvalid(methodID))
}
