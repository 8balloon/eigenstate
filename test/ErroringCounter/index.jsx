import { Provider, Store, logVerbosely } from '../../src'

const erroringStore = Store({

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
  pureANDImpureIncremenet: (payload, state) => {
    state.incrementCount(1337)
    return {
      count: state.count + payload
    }
  },
  pureANDImpureAsyncIncrement: ({amount, delay}, state) => {
    setTimeout(() => state.incrementCount(amount), delay)
    return {
      count: state.count + amount
    }
  },
  methodThatRemovesOtherMethod: (payload, state) => {
    return {pureANDImpureIncremenet: null}
  },
  downCount: {
    count: 0,
    random: Math.random(),
    decrement: (payload, state) => ({
      count: state.count - payload
    })
  },
  addNewKeyByMethod: (_, state) => ({ asdf: 'fdsa' })
},
logVerbosely)

const View = function CounterView(props) {

  window.props = props

  return (
    <div className="erroringCounter">
      <div className="count">
        {props.count}
      </div>
      <div className="fastIncrement" onClick={() => props.incrementCount(1)}>
        small fast increment
      </div>
      <div className="slowIncrement" onClick={() => props.slowIncrement(7)}>
        big slow increment
      </div>
      <div className="erringIncrementReducer" onClick={() => props.erringIncrementReducer(7)}>
        erringIncrementReducer
      </div>
      <div className="erringSlowIncrementProcedure" onClick={() => props.erringSlowIncrementProcedure(7)}>
        erringSlowIncrementProcedure
      </div>
      <div className="pureANDImpureIncremenet" onClick={() => props.pureANDImpureIncremenet(7)}>
        pureANDImpureIncremenet
      </div>
      <div className="pureANDImpureAsyncIncrement" onClick={() => {
        props.pureANDImpureAsyncIncrement({amount: 101, delay: 0})
        props.pureANDImpureAsyncIncrement({amount: 505, delay: 100})
      }}>
        pureANDImpureAsyncIncrement
      </div>
      <div className="methodThatRemovesOtherMethod" onClick={() => props.methodThatRemovesOtherMethod(7)}>
        methodThatRemovesOtherMethod
      </div>
      <div className="tooManyArgumentsIncrement" onClick={() => props.incrementCount(1, 2)}>
        call increment with too many arguments
      </div>
      <div className="downCount">
        <div>{props.downCount.count}</div>
        <div>{props.downCount.random + ' <=shouldn\'t change'}</div>
      </div>
      <div className="downCount.decrement" onClick={() => props.downCount.decrement(7)}>
        call nested decrement count
      </div>
      <div className="safeCount">
        {props.safeCount}
      </div>
      <div className="addNewKeyByMethod" onClick={props.addNewKeyByMethod}>
        addNewKeyByMethod
      </div>
    </div>
  )
}

export default function ErroringCounter() {
  return (
    <Provider store={erroringStore}>
      <View />
    </Provider>
  )
}
