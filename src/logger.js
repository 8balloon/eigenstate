export function verboseLogger(executeUpdate, payload, extras) {

  const { key, getState } = extras

  console.log("UPDATE KEY:", key)
  console.log("PAYLOAD:", payload)

  executeUpdate(payload)

  console.log("NEXT STATE:", getState())
}
