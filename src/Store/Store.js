import assert from '../validation/assert'
import StateTree from './StateTree'
import Batcher from './Batcher'

export function Store(stateDef) {

  assert.stateDefIsObject(stateDef)

  var state = null
  var subscribers = []

  const executeUpdateViaSubscriber = (nextState, invocationDetails, executeUpdate) => {
    state = nextState
    subscribers.forEach(sub => sub(invocationDetails, executeUpdate))
  }

  var batcher = Batcher(executeUpdateViaSubscriber)
  state = StateTree(stateDef, batcher.handleInvocation, batcher.enqueueEffect)

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
