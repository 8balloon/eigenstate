export const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const noProviderChangesProp = 'Switchless Provider requires an "changes" property'
export const changesLeavesNotFunctions = 'Switchless Provider.props.changes must contain values that are Functions'
export const middlewareIsNotFunction = 'Switchless Provider middleware must be a Function'

export function tooManyChangeArguments(key, path) {
  return `Change "${key}" at path "${path}" was called with multiple arguments. Changes may only be invoked with a single argument; see ${documentationURL}`
}

export function newStateLacksShapeOfOriginalState(key, path, prop) {
  return `Change "${key}" at path "${path}" returned a state which lacks property "${prop}". You cannot remove properties defined via Provider.changes.`
}

export function changeFunctionWasChanged(key, path, prop) {
  return `Change "${key}" at path "${path}" returned a state which lacks the original change function with key "${prop}". You cannot change udpate functions at runtime.`
}
