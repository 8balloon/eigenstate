const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "A stateDef object is required by the Eigenstate Provider"
export const methodsLeavesNotFunctions = 'Switchless Provider.props.methods must contain values that are Functions'
export const onMethodPropIsNotFunction = 'Switchless Provider onMethod must be a Function'

export function eigenstatePropConflict(key) {
  return `There was a conflict between state "${key}" and prop "${key}" on an Eigenstate <Provider> child or an Eigenstate connect()ed component. You are encouraged to avoid state/prop conflicts. State is being overridden by props.`
}

export function providerPropLocalPropConflict(key) {
  return `There was a conflict between Provider property "${key}" and local property "${key}" on a connect()ed component. You are encouraged to avoid Provider/local prop conflicts. Provider prop is being is being overridden by local prop.`
}

export function tooManyMethodArguments(key, path) {
  return `Method "${key}" at path "${path}" was called with multiple arguments. Methods may only be invoked with a single argument. See ${documentationURL}`
}

export function methodDidNotReturnObject(key, path) {
  return `Method "${key}" at path "${path}" did not return an object. Values must be returned via { key: value } objects. See ${documentationURL}`
}

export function methodWasOverwritten(key, path, localKey) {
  return `Method "${key}" at path "${path}" returned a value which overwrote a method at key "${localKey}". Methods may not be overwritten.`
}

export function operationInvokedOtherMethod(key, path) {
  return `Method ${key} at path ${path} is incorrectly composed, and will result in an inconsistent state when used. Methods should return a value XOR call other methods. See ${documentationURL}`
}

export function methodReturnIsNotJSON(key, path) {
  return `Method ${key} at path ${path} returned a non-JSON value. Eigentreee does not support non-JSON values. See ${documentationURL}`
}
