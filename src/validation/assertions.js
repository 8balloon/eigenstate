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

export function stateDefIsObject(stateDef) {

  if ( !(stateDef instanceof Object) || (stateDef instanceof Function) || (stateDef === null) ) {
    throw new Error(errorMessages.stateDefIsNotObject)
  }
}


export function onChangePropIsFunction(onChange) {

  isFunction(onChange, errorMessages.onChangePropIsNotFunction)
}

export function methodWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (illegalSecondArgument !== undefined) {
    throw new Error(errorMessages.tooManyMethodArguments(key))
  }
}

function containsNoFunctions(objTree, errorMessage) {
  mapObjectTreeLeaves(objTree, (val) => {
    if (val instanceof Function) {
      throw new Error(errorMessage)
    }
  })
}

export function noOtherMethodsHaveBeenInvoked(thisInvocationID, latestInvocationID) {
  if (thisInvocationID !== latestInvocationID) {
    throw new Error(`Method ${key} at path ${path} is incorrectly composed, and will result in an inconsistent state when used. Methods should return a value XOR call other methods. See "methods in depth" at ${documentationURL}`)
  }
}

export function methodReturnFitsStateDef(newState, stateDefinitions, key, path) {

  for (var prop in newState) {
    if (!(prop in stateDefinitions)) {
      throw new Error(errorMessages.newStateLacksShapeOfOriginalState(key, path, prop)) //revisit
    }

    const newStateProperty = newState[prop] //need renaming
    const statePropertyDefinition = stateDefinitions[prop]

    if (statePropertyDefinition instanceof Function) {
      if (!(newStateProperty instanceof Function)) {
        throw new Error("State method was replaced!!") //revisit
      }

      if (newStateProperty.__definition !== statePropertyDefinition) {
        throw new Error(errorMessages.methodFunctionWasChanged(key, path, prop))
      }
    }
    else {
      //if value, ok
      if ((statePropertyDefinition instanceof Object) && (statePropertyDefinition !== null)) {
        if (!(newStateProperty instanceof Object) || (newStateProperty === null)) {
          containsNoFunctions(statePropertyDefinition, 'A method that was defined has been removed by method yayhda at path yayadadada') //revisit
        }
        else {
          methodReturnFitsStateDef(newStateProperty, statePropertyDefinition, key, path) //are key and path correct here?
        }
      }
    }
  }
}
