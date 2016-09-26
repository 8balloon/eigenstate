export default {

  count: 0,

  incrementCount: (payload, state) => ({
    count: state.count + payload
  }),

  slowIncrement: (payload, state) => {
    setTimeout(() => state.incrementCount(payload), 1000)
  },

  erringIncrementReducer: (payload, state) => {
    state.incrementCount(payload)
    return {
      count: state.count + payload
    }
  },

  erringSlowIncrementProcedure: (payload, state) => {

    setTimeout(() => state.incrementCount(payload), 1000)
    return 123
  },

  implBadIncrementCount: (payload, state) => {
    state.incrementCount(1337)
    return {
      count: state.count + payload
    }
  },

  methodThatRemovesOtherMethod: (payload, state) => {
    return {implBadIncrementCount: null}
  },

  downCount: {
    count: 0,
    decrement: (payload, state) => ({
      count: state.count - payload
    })
  },

  cubeCount: {
    pretentiousNesting: {
      count: 12321,
      increment: (payload, state) => ({
        count: state.count + 1
      })
    }
  }
}
