export function logAction(action) {

  const {
    methodKey,
    methodPath,
    payload,
    returnValue,
    localState,
    nextLocalState
  } = action

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED with payload / return:`, payload, returnValue)
  console.log('local state before / after:', localState, nextLocalState)
}
