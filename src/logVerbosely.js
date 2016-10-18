import { isProduction } from './utils'

export function logVerbosely(nextState, invocationDetails) {

  if (isProduction) return

  const {
    methodPath,
    localState,
    methodKey,
    payload,
    returnValue,
    // "nextLocalState" is available, but not used here.
  } = invocationDetails

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- state / payload / return:`, localState, payload, returnValue)
}
