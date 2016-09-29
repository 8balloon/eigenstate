import { isObject, mapObjectTreeLeaves } from '../utils'
import * as errorMessages from './errorMessages'

export function leavesAreFunctions(objTree, errorMessage) {

  mapObjectTreeLeaves(objTree, (val, key, path) => {

    if (!(val instanceof Function)) {
      throw new Error(errorMessage + '(At: ' + path.join('.') + '.' + key + ')')
    }
  })
}

export function stateDefIsObject(stateDef) {

  if (!(isObject(stateDef))) {
    throw new Error(errorMessages.stateDefIsNotObject)
  }
}

export function onActionPropIsFunction(onAction) {

  if (!(onAction instanceof Function)) {
    throw new Error(errorMessages.onActionPropIsNotFunction)
  }
}

export function stateDoesNotConflictWithProps(state, props, key) {
  for (var key in props) {
    if (key in state) {
      console.warn(errorMessages.statePropConflict(key))
    }
  }
}

export function methodWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (typeof illegalSecondArgument !== 'undefined') {
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

  if ( typeof Object !== 'object' || obj === null ) return

  mapObjectTreeLeaves(obj, (val) => {
    if (val instanceof Function) {
      throw new Error(errorMessage)
    }
  })
}

export function methodReturnFitsStateDef(newState, stateDefinitions, key, path) {

  isObject(newState, errorMessages.methodDidNotReturnObject(key, path))

  for (var localKey in newState) {

    const statePropertyDefinition = stateDefinitions[localKey]
    containsNoFunctions(statePropertyDefinition, errorMessages.methodWasOverwritten(key, path, localKey))
  }
}
