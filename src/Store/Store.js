import assert from '../validation/assert'
import StateTree from './StateTree'

export function Store(stateDef) {

  assert.stateDefIsObject(stateDef)

  var state = null
  var subscribers = []

  const executeUpdateViaSubscriber = (nextState, invocationDetails, executeUpdate) => {
    state = nextState
    subscribers.forEach(sub => sub(state, invocationDetails, executeUpdate))
  }

  state = StateTree(stateDef, executeUpdateViaSubscriber)

  var store = () => state
  store.subscribe = (newSub) => {

    assert.subscriberIsFunction(newSub)

    const thisSubscriberIndex = subscribers.length
    subscribers[thisSubscriberIndex] = newSub

    return function unsubscribeFromUpdates() {
      delete subscribers[thisSubscriberIndex]
      return true
    }
  }
  return store
}
