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

export function updateWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (illegalSecondArgument !== undefined) {
    throw new Error(errorMessages.tooManyUpdateArguments(key))
  }
}

export function newStateContainsShapeOfOriginalState(newState, originalState, key, path) {

  for (var prop in originalState) {
    if (!(prop in newState)) {
      throw new Error(errorMessages.newStateLacksShapeOfOriginalState(key, path, prop))
    }
  }
}
