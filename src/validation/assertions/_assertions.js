import { isObject, mapObjectTreeLeaves } from '../../utils'
import * as errorMessages from '../errorMessages'

export function stateDefIsObject(stateDef) {

  if (!(isObject(stateDef))) {
    throw new Error(errorMessages.stateDefIsNotObject)
  }
}

export function onUpdatePropIsFunction(onUpdate) {

  if (!(onUpdate instanceof Function)) {
    throw new Error(errorMessages.onUpdatePropIsNotFunction)
  }
}

export function methodWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (typeof illegalSecondArgument !== 'undefined') {
    throw new Error(errorMessages.tooManyMethodArguments(key, path))
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

function returnDataIsJSON(returnData, key, path) {

  try {
    JSON.stringify(returnData)
  }
  catch (err) {
    throw new Error(errorMessages.returnedDataIsNotJSON(key, path))
  }
}

export function returnDataFitsStateDef(returnData, stateDefinitions, key, path) {

  returnDataIsJSON(returnData, key, path)

  isObject(returnData, errorMessages.returnDataIsNotObject(key, path))

  for (var localKey in returnData) {

    const statePropertyDefinition = stateDefinitions[localKey]
    containsNoFunctions(statePropertyDefinition, errorMessages.methodWasOverwritten(key, path, localKey))
  }
}
