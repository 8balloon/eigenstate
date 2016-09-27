export default function Store() {

  var eigenstate = null
    , onSetStateCallback = null
    , cbIntervalID = null
    // , updatesBatched = 0

  const getState = () => eigenstate
  const setOnSetStateCallback = (cb) => { onSetStateCallback = cb }
  const setState = (state, callerCallback) => {

    eigenstate = state

    cbIntervalID && clearInterval(cbIntervalID)
    cbIntervalID = setInterval(() => {

      // The onSetStateCallback is expected to call the callerCallback
      onSetStateCallback && onSetStateCallback(callerCallback)

      clearInterval(cbIntervalID)
      cbIntervalID = null
      // console.log("!!!UPDATES BATCHED:", updatesBatched)
      // updatesBatched = 0
    }, 0)
    // updatesBatched++
  }

  return {
    getState,
    setOnSetStateCallback,
    setState
  }
}
