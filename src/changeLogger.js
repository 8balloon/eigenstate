export function changeLogger(executeChange, payload, extras) {

  const { path, key } = extras

  console.log("CHANGE PERFORMED:", path.join('.') + '.' + key)
  console.log("PAYLOAD:", payload)

  executeChange(payload)
}
