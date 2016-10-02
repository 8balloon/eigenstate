const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "A stateDef object is required by the Eigenstate Provider"
export const methodsLeavesNotFunctions = 'Switchless Provider.props.methods must contain values that are Functions'
export const onMethodPropIsNotFunction = 'Switchless Provider onMethod must be a Function'

export function tooManyMethodArguments(key, path) {
  return `The method "${path.join('.') + '.' + key}" was called with multiple arguments. Methods may only be invoked with a single argument. See ${documentationURL}`
}

export function methodDidNotReturnObject(key, path) {
  return `The method "${path.join('.') + '.' + key}" did not return an object. Values must be returned via { key: value } objects. See ${documentationURL}`
}

export function methodWasOverwritten(key, path, localKey) {
  return `The method "${path.join('.') + '.' + key}" returned a value with key "${localKey}", which is the key of a method. Methods can not be overridden by values.`
}

export function operationInvokedOtherMethod(key, path) {
  return `The method "${path.join('.') + '.' + key}" invoked another method before returning. This will result in an inconsistent application state. Methods must return a value XOR call other methods. See ${documentationURL}`
}

export function methodReturnIsNotJSON(key, path) {
  return `Method ${key} at path ${path} returned a non-JSON value. Eigentreee does not support non-JSON values. See ${documentationURL}`
}
