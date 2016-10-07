import { isObject, mapObjectTreeLeaves } from '../../utils'
import * as errorMessages from '../errorMessages'

export function stateDefIsObject(stateDef) {

  if (!(isObject(stateDef))) {
    throw new Error(errorMessages.stateDefIsNotObject)
  }
}

export function onInvokePropIsFunction(onInvoke) {

  if (!(onInvoke instanceof Function)) {
    throw new Error(errorMessages.onInvokePropIsNotFunction)
  }
}

export function methodWasNotPassedSecondArgument(illegalSecondArgument, key, path) {

  if (typeof illegalSecondArgument !== 'undefined') {
    throw new Error(errorMessages.tooManyMethodArguments(key, path))
  }
}

export function dataReturnerDidNotInvokeMethod(thisInvocationID, latestInvocationID, key, path) {
  if (thisInvocationID !== latestInvocationID) {
    throw new Error(errorMessages.dataReturnerInvokedOtherMethod(key, path))
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

function returnDataIsJSONObject(returnData, key, path) {

  if (!isObject(returnData)) {
    throw new Error(errorMessages.returnDataIsNotObject(key, path))
  }

  try {
    JSON.stringify(returnData)
  }
  catch (err) {
    throw new Error(errorMessages.returnedDataIsNotJSON(key, path))
  }
}

export function returnDataFitsStateDef(returnData, stateDef, key, path) {

  returnDataIsJSONObject(returnData, key, path)

  for (var localKey in returnData) {

    const stateDefProperty = stateDef[localKey]

    containsNoFunctions(stateDefProperty, errorMessages.methodWasOverwritten(key, path, localKey))
  }
}
