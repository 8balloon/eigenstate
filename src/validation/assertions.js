import { mapObjectTreeLeaves } from '../utils'
import * as errorMessages from './errorMessages'

// js assertions

export function isObject(value, errorMessage) {

  if (!(value instanceof Object) || (value instanceof Function) || (value === null)) {
    throw new Error(errorMessage)
  }
}

export function isFunction(value, errorMessage) {

  if (!(value instanceof Function)) {
    throw new Error(errorMessage)
  }
}

export function leavesAreFunctions(objTree, errorMessage) {

  mapObjectTreeLeaves(objTree, (val, key, path) => {

    if (!(val instanceof Function)) {
      throw new Error(errorMessage + '(At: ' + path.join('.') + '.' + key + ')')
    }
  })
}

// validation assertions

export function middlewareIsValid(middleware) {

  isFunction(middleware, errorMessages.middlewareIsNotFunction)
}

export function changeWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (illegalSecondArgument !== undefined) {
    throw new Error(errorMessages.tooManyChangeArguments(key))
  }
}

export function newStateMatchesDefinition(newState, originalState, key, path) {

  for (var prop in originalState) {
    if (!(prop in newState)) {
      throw new Error(errorMessages.newStateLacksShapeOfOriginalState(key, path, prop))
    }

    const newValue = newState[prop]

    if (newValue instanceof Function) {

      const newBaseChangeFunction = newValue.__baseChangeFunction
      const originalBaseChangeFunction = originalState[prop]

      if (newBaseChangeFunction !== originalBaseChangeFunction) {
        throw new Error(errorMessages.changeFunctionWasChanged(key, path, prop))
      }
    }
  }
}
