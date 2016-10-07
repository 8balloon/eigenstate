export function logVerbosely(change) {

  const {
    methodPath,
    localState,
    methodKey,
    payload,
    returnValue,
    nextLocalState
  } = change

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- state / payload / return:`, localState, payload, returnValue)
}
