import { Provider, logVerbosely } from '../../src'

const stateDef = {

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
    random: Math.random(),
    decrement: (payload, state) => ({
      count: state.count - payload
    })
  },
  addNewKeyByMethod: (_, state) => ({ asdf: 'fdsa' })
}

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
      <div className="implBadIncrementCount" onClick={() => props.implBadIncrementCount(7)}>
        implBadIncrementCount
      </div>
      <div className="methodThatRemovesOtherMethod" onClick={() => props.methodThatRemovesOtherMethod(7)}>
        methodThatRemovesOtherMethod
      </div>
      <div className="tooManyArgumentsIncrement" onClick={() => props.incrementCount(1, 2)}>
        call increment with too many arguments
      </div>
      <div className="downCount">
        <div>{props.downCount.count}</div>
        <div>{props.downCount.random + ' <=should remain the same when nested decrement count is called'}</div>
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
    <Provider stateDef={stateDef} onInvoke={logVerbosely}>
      <View />
    </Provider>
  )
}
