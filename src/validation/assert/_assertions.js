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

export function subscriberIsFunction(subscriber) {

  if (!(subscriber instanceof Function)) {
    throw new Error(errorMessages.subscriberIsNotFunction)
  }
}

export function storeIsFunction(store) {
  if (!(store instanceof Function)) {
    throw new Error(errorMessages.storeIsNotFunction)
  }
}

export function noSecondArgumentWasPassed(illegalSecondArgument, key) {

  if (typeof illegalSecondArgument !== 'undefined') {
    throw new Error(errorMessages.tooManyMethodArguments(key))
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

function returnDataIsJSONObject(returnData, key) {

  assertIsObject(returnData, errorMessages.returnDataIsNotObject(key))
  isJSON(errorMessages.returnedDataIsNotJSON(key))
}

export function returnDataFitsStateDef(returnData, stateDef, key) {

  returnDataIsJSONObject(returnData, key)

  for (let returnedKey in returnData) {

    const stateDefProperty = stateDef[returnedKey]

    containsNoFunctions(stateDefProperty, errorMessages.methodWasOverwritten(key, returnedKey))
  }
}

export function effectReturnsUndefined(effectReturn, effect) {

  if (effectReturn !== undefined) {
    console.warn(errorMessages.effectReturnedValue, effect, effectReturn)
  }
}
