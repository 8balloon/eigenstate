export function logVerbosely(changes) {

  for (var i = 0; i < changes.length; i++) {

    const {
      methodKey,
      methodPath,
      payload,
      returnValue,
      localState,
      nextLocalState
    } = changes[i]

    console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED with state / payload / return:`, localState, payload, returnValue)
  }
}
