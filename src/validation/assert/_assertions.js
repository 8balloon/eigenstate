import { isObject, mapObjectTreeLeaves } from '../../utils'
import * as errorMessages from '../errorMessages'

function assertIsObject(value, errorMessage) {
  if (!(isObject(value))) {
    throw new Error(errorMessage)
  }
}

export function stateDefIsObject(stateDef) {

  assertIsObject(stateDef, errorMessages.stateDefIsNotObject)
}

export function updateSubscriberIsFunction(onUpdate) {

  if (!(onUpdate instanceof Function)) {
    throw new Error(errorMessages.onUpdateIsNotFunction)
  }
}

export function methodSubscriberIsFunction(onMethod) {

  if (!(onMethod instanceof Function)) {
    throw new Error(errorMessages.onMethodIsNotFunction)
  }
}

export function storeIsFunction(store) {
  if (!(store instanceof Function)) {
    throw new Error(errorMessages.storeIsNotFunction)
  }
}

export function noSecondArgumentWasPassed(illegalSecondArgument, key, path) {

  if (typeof illegalSecondArgument !== 'undefined') {
    throw new Error(errorMessages.tooManyMethodArguments(key, path))
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

function isJSON(value, errorMessage) {
  try {
    JSON.stringify(value)
  }
  catch (err) {
    throw new Error(errorMessage)
  }
}

function returnDataIsJSONObject(returnData, key, path) {

  assertIsObject(returnData, errorMessages.returnDataIsNotObject(key, path))
  isJSON(errorMessages.returnedDataIsNotJSON(key, path))
}

export function returnDataFitsStateDef(returnData, stateDef, key, path) {

  returnDataIsJSONObject(returnData, key, path)

  for (var localKey in returnData) {

    const stateDefProperty = stateDef[localKey]

    containsNoFunctions(stateDefProperty, errorMessages.methodWasOverwritten(key, path, localKey))
  }
}
