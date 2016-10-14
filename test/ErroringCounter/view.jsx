export default function CounterView(props) {

  window.props = props

  const {
    count,
    incrementCount,
    slowIncrement,
    erringIncrementReducer,
    erringSlowIncrementProcedure,
    implBadIncrementCount,
    methodThatRemovesOtherMethod,
    downCount
  } = props

  return (
    <div className="erroringCounter">
      <div className="count">
        {count}
      </div>
      <div className="fastIncrement" onClick={() => incrementCount(1)}>
        small fast increment
      </div>
      <div className="slowIncrement" onClick={() => slowIncrement(7)}>
        big slow increment
      </div>
      <div className="erringIncrementReducer" onClick={() => erringIncrementReducer(7)}>
        erringIncrementReducer
      </div>
      <div className="erringSlowIncrementProcedure" onClick={() => erringSlowIncrementProcedure(7)}>
        erringSlowIncrementProcedure
      </div>
      <div className="implBadIncrementCount" onClick={() => implBadIncrementCount(7)}>
        implBadIncrementCount
      </div>
      <div className="methodThatRemovesOtherMethod" onClick={() => methodThatRemovesOtherMethod(7)}>
        methodThatRemovesOtherMethod
      </div>
      <div className="tooManyArgumentsIncrement" onClick={() => incrementCount(1, 2)}>
        call increment with too many arguments
      </div>
      <div className="downCount">
        <div>{downCount.count}</div>
        <div>{downCount.random + ' <=should remain the same when nested decrement count is called'}</div>
      </div>
      <div className="downCount.decrement" onClick={() => downCount.decrement(7)}>
        call nested decrement count
      </div>
      <div className="safeCount">
        {props.safeCount}
      </div>
      <div className="safeIncrement" onClick={() => props.safeIncrement(10)}>
        SAFE INCREMENT
      </div>
      <div className="safeDoubleIncrement" onClick={props.safeDoubleIncrement}>
        SAFE DOUBLE INCREMENT
      </div>
      <div className="addNewKeyByMethod" onClick={props.addNewKeyByMethod}>
        addNewKeyByMethod
      </div>
    </div>
  )
}
