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

function containsNoFunctions(objTree, errorMessage) {
  mapObjectTreeLeaves(objTree, (val) => {
    if (val instanceof Function) {
      throw new Error(errorMessage)
    }
  })
}

export function changesMatchDefinition(stateChanges, stateDefinitions, key, path) {

  for (var prop in stateChanges) {
    if (!(prop in stateDefinitions)) {
      throw new Error(errorMessages.newStateLacksShapeOfOriginalState(key, path, prop)) //revisit
    }

    const stateChange = stateChanges[prop] //need renaming
    const stateDefinition = stateDefinitions[prop]

    if (stateDefinition instanceof Function) {
      if (!(stateChange instanceof Function)) {
        throw new Error("State change function was replaced!!") //revisit
      }

      if (stateChange.__baseChangeFunction !== stateDefinition) {
        throw new Error(errorMessages.changeFunctionWasChanged(key, path, prop))
      }
    }
    else {
      //if value, ok
      if ((stateDefinition instanceof Object) && (stateDefinition !== null)) {
        if (!(stateChange instanceof Object) || (stateChange === null)) {
          containsNoFunctions(stateDefinition, 'A change function that was defined has been removed by change yayhda at path yayadadada') //revisit
        }
        else {
          changesMatchDefinition(stateChange, stateDefinition, key, path) //are key and path correct here?
        }
      }
    }
  }
}
