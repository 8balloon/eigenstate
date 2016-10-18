import { isProduction } from './utils'

export function verboseLogger(nextState, invocationDetails) {

  if (isProduction) return

  const {
    methodPath,
    localState,
    methodKey,
    payload,
    returnValue,
    // "nextLocalState" is available, but not used here.
  } = invocationDetails

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED with state / payload / return:`, localState, payload, returnValue)
}
