export function logVerbosely(details) {

  const {
    key,
    path,
    payload,
    contextStateAtPath,
    localChangeResults,
    newLocalState
  } = details

  console.log("CHANGE DETAILS:", details)
}
