export default function Counter(props) {

  console.log("STATE:", props)
  window.state = props

  const {
    count,
    incrementCount,
    slowIncrement,
    erringIncrementReducer,
    erringSlowIncrementProcedure,
    implBadIncrementCount,
    erringProviderUpdatePropRemovingUpdate,
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
      <div className="erringProviderUpdatePropRemovingUpdate" onClick={() => erringProviderUpdatePropRemovingUpdate(7)}>
        erringProviderUpdatePropRemovingUpdate
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
