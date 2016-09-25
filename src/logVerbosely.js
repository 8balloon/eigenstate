export function logVerbosely(details) {

  const {
    key,
    path,
    payload,
    contextStateAtPath,
    localMethodReturns,
    newLocalState
  } = details

  console.log("CHANGE DETAILS:", details)
}
