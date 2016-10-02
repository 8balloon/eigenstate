const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "No stateDef prop was detected by the Eigenstate Provider. Did you provide a stateDef via <Provider stateDef={yourStateDef}> ?"

export function tooManyMethodArguments(key, path) {
  return `Multiple arguments were passed to "${path.join('.') + '.' + key}". Eigenstate provides a second argument automatically, so passing multiple arguments is not supported. Did you remember to pass only a single argument?`
}

export function methodDidNotReturnObject(key, path) {
  return `The method "${path.join('.') + '.' + key}" did not return an object. Did you remember to wrap your return values in a { key: value } object? See ${documentationURL}`
}

export function methodWasOverwritten(key, path, localKey) {
  return `The method "${path.join('.') + '.' + key}" returned a value with key "${localKey}", which appears to be a method. Did you make sure that your { key: value } keys do not conflict with method keys?`
}

export function operationInvokedOtherMethod(key, path) {
  return `The method "${path.join('.') + '.' + key}" invoked another method before returning. This will result in an inconsistent application state. Methods must return a value XOR call other methods. See ${documentationURL}`
}

export function methodReturnIsNotJSON(key, path) {
  return `Method ${key} at path ${path} returned a non-JSON value. Eigentreee does not support non-JSON values. See ${documentationURL}`
}
