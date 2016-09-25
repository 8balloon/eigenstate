export const documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md'

export const stateDefIsNotObject = "A stateDef object is required by the Eigenstate Provider"
export const methodsLeavesNotFunctions = 'Switchless Provider.props.methods must contain values that are Functions'
export const onMethodPropIsNotFunction = 'Switchless Provider onMethod must be a Function'

export function statePropConflict(key) {
  return `There was a conflict between state "${key}" and prop "${key}" on an Eigenstate <Provider> child or an Eigenstate connect()ed component. You are encouraged to avoid state/prop conflicts. State is being overridden by props.`
}

export function tooManyMethodArguments(key, path) {
  return `Method "${key}" at path "${path}" was called with multiple arguments. Methods may only be invoked with a single argument; see ${documentationURL}`
}

export function functionWasReturned(key, path, localKey) {
  return `Method "${key}" at path "${path}" returned a function via key "${localKey}". Methods may only return values.`
}

export function methodWasOverwritten(key, path, localKey) {
  return `Method "${key}" at path "${path}" returned a value which overwrote a method at key "${localKey}". Methods may not be overwritten.`
}
