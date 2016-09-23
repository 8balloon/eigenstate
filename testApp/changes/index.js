export default {

  count: 0,

  incrementCount: (payload, state) => ({...state,
    count: state.count + payload
  }),

  slowIncrement: (payload, state) => {
    setTimeout(() => state.incrementCount(payload), 1000)
  },

  erringIncrementReducer: (payload, state) => {
    state.incrementCount(payload)
    return {...state,
      count: state.count + payload
    }
  },

  erringSlowIncrementProcedure: (payload, state) => {

    setTimeout(() => state.incrementCount(payload), 1000)
    return 123
  },

  implBadIncrementCount: (payload, state) => {
    state.incrementCount(1337)
    return {...state,
      count: state.count + payload
    }
  },

  changeThatRemovesChange: (payload, state) => {
    return {}
  },

  erringChangeSwapper: (payload, state) => {
    return {
      ...state,
      changeThatRemovesChange: function foo() {}
    }
  },

  downCount: {

    count: 0,

    decrement: (payload, state) => ({...state,
      count: state.count - payload
    })

  },

  squareCount: {

    count: 2,

    square: (payload, state) => ({...state,
      count: state.count * state.count
    }),

    triggerIncrement: (payload, state) => state.incrementCount(2416)

  },

  cubeCount: {

    pretentiousNesting: {

      count: 12321,

      increment: (payload, state) => ({...state,
        count: state.count + 1
      })

    }

  }

}
