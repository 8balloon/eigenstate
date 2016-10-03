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

    console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED with payload / return:`, payload, returnValue)
    console.log('local state before / after:', localState, nextLocalState)
  }
}
