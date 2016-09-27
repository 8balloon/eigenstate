export function logVerbosely(details) {

  const {
    methodKey,
    methodPath,
    payload,
    returnValue,
    previousLocalState,
    localState,
    state
  } = details

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED`)
  console.log('payload / return:', payload, returnValue)
  console.log('local state before / local state after / final state:', previousLocalState, localState, state)
}
