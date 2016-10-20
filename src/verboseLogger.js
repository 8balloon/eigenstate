export function verboseLogger(invocationDetails) {

  const { methodPath, methodKey, returnValue } = invocationDetails

  console.log(`--> ${ methodPath.join('.') + '.' + methodKey } <-- METHOD CALLED.`)

  if ( returnValue !== undefined ) {
    console.log('  return:', returnValue)
  }

  console.log('  details:', invocationDetails)
}
