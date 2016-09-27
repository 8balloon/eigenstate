export default function Store() {

  var eigenstate = null
    , onSetStateCallback = null
    , cbIntervalID = null
    // , updatesBatched = 0

  const store = {

    getState: () => eigenstate,

    setState: (state, onSetStateCallbackCallback) => {

      eigenstate = state

      cbIntervalID && clearInterval(cbIntervalID)
      cbIntervalID = setInterval(() => {

        onSetStateCallback && onSetStateCallback(onSetStateCallbackCallback)

        clearInterval(cbIntervalID)
        cbIntervalID = null
        // console.log("!!!UPDATES BATCHED:", updatesBatched)
        // updatesBatched = 0
      }, 0)
      // updatesBatched++
    },

    setOnSetStateCallback: (cb) => {
      onSetStateCallback = cb
    }
  }

  return store
}
