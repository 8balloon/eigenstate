const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "The Store constructor function requires a stateDef object as an argument."
export const subscriberIsNotFunction = "Store subscribers must be functions."
export const storeIsNotFunction = "The 'store' argument you provided to connect does not appear to be a valid Eigenstate store. Did you remember to create it with Store(), imported from 'eigenstate'?"
export const effectReturnedValue = "An Effect returned a value. This value will have no effect. The Effect and the returned value are:"

export function tooManyMethodArguments(key) {
  return `Multiple arguments were passed to "${key}". StateTree provides a second argument automatically, so passing multiple arguments is not supported.`
}

export function returnDataIsNotObject(key) {
  return `The method "${key}" did not return a valid data object. Did you remember to wrap your data values in a JSON object? See ${documentationURL}`
}

export function methodWasOverwritten(key, returnedKey) {
  return `The method "${key}" returned an object with key "${returnedKey}". There appears to be a method with that key. Did you make sure that your { key: value } data object keys do not conflict with method keys?`
}

export function returnedDataIsNotJSON(key) {
  return `The method "${key}" returned a non-JSON value. State data returned by methods must be valid JSON. See ${documentationURL}`
}

export function dataReturnerInvokedOtherMethod(key) {
  return `The method "${key}" invoked another method before returning. Methods should return data OR invoke other methods -- in other words, please separate your pure and impure methods. See ${documentationURL}`
}
