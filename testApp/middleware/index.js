import { verboseLogger } from '../../src'

export default function testMiddleware(executeUpdate, payload, extras) {

  var newPayload

  if (payload === 7) {

    console.log("7!? Let it be squared.")
    newPayload = payload * payload
  }
  else {

    newPayload = payload
  }

  verboseLogger(executeUpdate, newPayload, extras)
}
