export default function CounterView(props) {

  window.props = props
  console.log("PROVIDER TEST PROP IN COUNTER VIEW:", props.testProviderProp)

  const {
    count,
    incrementCount,
    slowIncrement,
    erringIncrementReducer,
    erringSlowIncrementProcedure,
    implBadIncrementCount,
    methodThatRemovesOtherMethod,
    erringChangeSwapper,
    downCount
  } = props

  return (
    <div className="counter">
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
        {downCount.count}
      </div>
      <div className="downCount.decrement" onClick={() => downCount.decrement(7)}>
        call nested decrement count
      </div>
    </div>
  )
}
