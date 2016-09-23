import { changeLogger } from '../../src'

export default function testMiddleware(executeChange, payload, extras) {

  var newPayload

  if (payload === 7) {

    console.log("7!? Let it be squared.")
    newPayload = payload * payload
  }
  else {

    newPayload = payload
  }

  changeLogger(executeChange, newPayload, extras)
}
