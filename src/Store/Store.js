import assert from '../validation/assert'
import StateTree from './StateTree'

export function Store(stateDef) {

  assert.stateDefIsObject(stateDef)

  var updateSubs = []

  var state = null

  const executeUpdateViaSubscriber = (nextState, invocationDetails, executeUpdate) => {
    state = nextState
    updateSubs.forEach(sub => sub(state, invocationDetails, executeUpdate))
  }

  state = StateTree(stateDef, executeUpdateViaSubscriber)

  var store = () => state
  store.subscribe = (newUpdateSubscriber) => {

    assert.updateSubscriberIsFunction(newUpdateSubscriber)

    const thisUpdateSubIndex = updateSubs.length
    updateSubs[thisUpdateSubIndex] = newUpdateSubscriber

    return function unsubscribeFromUpdates() {
      delete updateSubs[thisUpdateSubIndex]
      return true
    }
  }
  return store
}
