export const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const noProviderUpdatesProp = 'Switchless Provider requires an "updates" property'
export const updatesLeavesNotFunctions = 'Switchless Provider.props.updates must contain values that are Functions'
export const middlewareIsNotFunction = 'Switchless Provider middleware must be a Function'

export function tooManyUpdateArguments(key, path) {
  return `Update "${key}" at path "${path}" was called with multiple arguments. Updates may only be invoked with a single argument; see ${documentationURL}`
}

export function newStateLacksShapeOfOriginalState(key, path, prop) {
  return `Update "${key}" at path "${path}" returned a state which lacks property "${prop}". You cannot remove properties defined via Provider.updates.`
}
