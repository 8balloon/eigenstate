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

export function onChangePropIsFunction(middleware) {

  isFunction(middleware, errorMessages.middlewareIsNotFunction)
}

export function changeWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (illegalSecondArgument !== undefined) {
    throw new Error(errorMessages.tooManyChangeArguments(key))
  }
}

function containsNoFunctions(objTree, errorMessage) {
  mapObjectTreeLeaves(objTree, (val) => {
    if (val instanceof Function) {
      throw new Error(errorMessage)
    }
  })
}

export function noOtherChangesHaveBeenInvoked(thisChangeInvocationID, latestChangeInvocationID) {
  if (thisChangeInvocationID !== latestChangeInvocationID) {
    throw new Error(`Change ${key} at path ${path} is incorrectly composed, and will result in an inconsistent state when used. Changes should return a value OR call other changes. See "Changes: Operations and Procedures" at ${documentationURL}`)
  }
}

export function changeResultsFitStateDef(stateChanges, stateDefinitions, key, path) {

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

      if (stateChange.__changeDefinition !== stateDefinition) {
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
          changeResultsFitStateDef(stateChange, stateDefinition, key, path) //are key and path correct here?
        }
      }
    }
  }
}
