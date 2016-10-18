import { isProduction } from './utils'

export function verboseLogger(invocationDetails) {

  if (isProduction) return

  const { methodPath, methodKey, returnValue } = invocationDetails

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED.`)
  console.log('  details:', invocationDetails)

  if ( returnValue !== undefined ) {
    console.log('  return:', returnValue)
  }
}
