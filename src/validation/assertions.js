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


export function onEventPropIsFunction(onEvent) {

  isFunction(onEvent, errorMessages.onEventPropIsNotFunction)
}

export function stateDoesNotConflictWithProps(state, props, key) {
  //props is likely (hopefully) smaller
  for (var key in props) {
    if (key in state) {
      console.warn(errorMessages.statePropConflict(key))
    }
  }
}

export function methodWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (illegalSecondArgument !== undefined) {
    throw new Error(errorMessages.tooManyMethodArguments(key))
  }
}

export function operationCompletedSynchronously(thisInvocationID, latestInvocationID, key, path) {
  if (thisInvocationID !== latestInvocationID) {
    throw new Error(errorMessages.operationInvokedOtherMethod(key, path))
  }
}

function containsNoFunctions(obj, errorMessage) {

  if (obj instanceof Function) {
    throw new Error(errorMessage)
  }

  if ( !(obj instanceof Object) || (obj === null) ) return

  mapObjectTreeLeaves(obj, (val) => {
    if (val instanceof Function) {
      throw new Error(errorMessage)
    }
  })
}

export function methodReturnFitsStateDef(newState, stateDefinitions, key, path) {

  isObject(newState, errorMessages.methodDidNotReturnObject(key, path))

  for (var localKey in newState) {

    const newStateProperty = newState[localKey]
    const statePropertyDefinition = stateDefinitions[localKey]

    containsNoFunctions(newStateProperty, errorMessages.functionWasReturned(key, path, localKey))
    containsNoFunctions(statePropertyDefinition, errorMessages.methodWasOverwritten(key, path, localKey))
  }
}
