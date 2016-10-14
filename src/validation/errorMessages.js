const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "No stateDef prop was detected by the StateTree Provider. Did you provide a stateDef via <Provider stateDef={yourStateDef}> ?"
export const onInvokePropIsNotFunction = "Provider.props.onInvoke must be a function."
export const propsDidChange = "An StateTree Provider had its props changed. State will be cleared and re-generated. Are you sure you meant to change Provider props? The Provider in question received these new props:"

export function tooManyMethodArguments(key, path) {
  return `Multiple arguments were passed to "${path.join('.') + '.' + key}". StateTree provides a second argument automatically, so passing multiple arguments is not supported.`
}

export function returnDataIsNotObject(key, path) {
  return `The method "${path.join('.') + '.' + key}" did not return a valid data object. Did you remember to wrap your data values in a JSON object? See ${documentationURL}`
}

export function methodWasOverwritten(key, path, localKey) {
  return `The method "${path.join('.') + '.' + key}" returned an object with key "${localKey}". There appears to be a method with that key. Did you make sure that your { key: value } data object keys do not conflict with method keys?`
}

export function returnedDataIsNotJSON(key, path) {
  return `The method "${path.join('.') + '.' + key}" returned a non-JSON value. State data returned by methods must be valid JSON. See ${documentationURL}`
}

export function payloadIsNotJSON(key, path) {
  return `The method "${path.join('.') + '.' + key}" was invoked with a non-JSON argument. Methods should only be called with JSON arguments. If you want to invoke functions in response to method invocations, use Provider.props.onInvoke. See ${documentationURL}`
}

export function dataReturnerInvokedOtherMethod(key, path) {
  return `The method "${path.join('.') + '.' + key}" invoked another method before returning. Methods should return data OR invoke other methods -- in other words, please separate your pure and impure methods. See ${documentationURL}`
}
