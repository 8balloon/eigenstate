export const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "A stateDef object is required by the Eigenstate Provider"
export const methodsLeavesNotFunctions = 'Switchless Provider.props.methods must contain values that are Functions'
export const onChangePropIsNotFunction = 'Switchless Provider onChange must be a Function'

export function tooManyMethodArguments(key, path) {
  return `Change "${key}" at path "${path}" was called with multiple arguments. Changes may only be invoked with a single argument; see ${documentationURL}`
}

export function newStateLacksShapeOfOriginalState(key, path, prop) {
  return `Change "${key}" at path "${path}" returned a state which lacks property "${prop}". You cannot remove properties defined via Provider.methods.`
}

export function methodFunctionWasChanged(key, path, prop) {
  return `Change "${key}" at path "${path}" returned a state which lacks the original method with key "${prop}". You cannot method udpate functions at runtime.`
}
