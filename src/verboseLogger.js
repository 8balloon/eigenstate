export function verboseLogger(invocationDetails) {

  const { methodKey, returnValue } = invocationDetails

  console.log(`--> ${methodKey} <-- METHOD CALLED.`)

  if ( returnValue !== undefined ) {
    console.log('  return:', returnValue)
  }

  console.log('  details:', invocationDetails)
}
