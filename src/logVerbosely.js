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
  console.log('PAYLOAD / RETURN:', payload, returnValue)
  console.log('STATE AT METHOD, BEFORE / AFTER:', previousLocalState, localState)
  console.log('COMPLETE STATE RESULT:', state)
}
