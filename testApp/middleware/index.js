import { updateLogger } from '../../src'

export default function testMiddleware(executeUpdate, payload, extras) {

  var newPayload

  if (payload === 7) {

    console.log("7!? Let it be squared.")
    newPayload = payload * payload
  }
  else {

    newPayload = payload
  }

  updateLogger(executeUpdate, newPayload, extras)
}
