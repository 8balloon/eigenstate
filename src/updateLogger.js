export function updateLogger(executeUpdate, payload, extras) {

  const { path, key } = extras

  console.log("UPDATE:", path.join('.') + '.' + key)
  console.log("PAYLOAD:", payload)

  executeUpdate(payload)
}
