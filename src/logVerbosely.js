export function logVerbosely(details) {

  const {
    methodKey,
    methodPath,
    payload,
    returnValue,
    localState,
    nextLocalState
  } = details

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED`)
  console.log('payload / return:', payload, returnValue)
  console.log('local state before / after:', localState, nextLocalState)
}
