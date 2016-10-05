const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "No stateDef prop was detected by the Eigenstate Provider. Did you provide a stateDef via <Provider stateDef={yourStateDef}> ?"
export const onUpdatePropIsNotFunction = "Provider.props.onUpdate must be a function."

export function tooManyMethodArguments(key, path) {
  return `Multiple arguments were passed to "${path.join('.') + '.' + key}". Eigenstate provides a second argument automatically, so passing multiple arguments is not supported.`
}

export function returnDataIsNotObject(key, path) {
  return `The method "${path.join('.') + '.' + key}" did not return a valid data object. Did you remember to wrap your data values in a JSON object? See ${documentationURL}`
}

export function methodWasOverwritten(key, path, localKey) {
  return `The method "${path.join('.') + '.' + key}" returned an object with key "${localKey}". There appears to be a method with that key. Did you make sure that your { key: value } data object keys do not conflict with method keys?`
}

export function dataReturnerInvokedOtherMethod(key, path) {
  return `The method "${path.join('.') + '.' + key}" invoked another method before returning. Methods must be pure (return data and do nothing else) XOR impure (do anything but return data). See ${documentationURL}`
}

export function returnedDataIsNotJSON(key, path) {
  return `Method ${key} at path ${path} returned a non-JSON value. State data returned by methods must be valid JSON. See ${documentationURL}`
}

export function statePropertyNotDefined(key, path, localKey) {
  return `The method "${path.join('.') + '.' + key}" returned an object with key "${localKey}", which is not a defined data key. Dynamically adding data keys next to method keys will make your application slower and less safe. Did you remember to define this data key in your stateDef?`
}
