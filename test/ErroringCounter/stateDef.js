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

  safeCount: 0,
  safeIncrement: (amount, state) => {
    return {
      safeCount: state.safeCount + amount
    }
  },
  safeDoubleIncrement: (_, state) => {
    state.safeIncrement(10)
    return () => state.safeIncrement(1)
  },

  addNewKeyByMethod: (_, state) => ({ asdf: 'fdsa' })
}
