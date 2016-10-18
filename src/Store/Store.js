import assert from '../validation/assert'
import StateTree from './StateTree'

export function Store(stateDef) {

  assert.stateDefIsObject(stateDef)

  var updateSubscribers = []
  var newUpdateSubscriberIndex = 2

  var methodSubscribers = []
  var newMethodSubscriberIndex = 2
  const onInvoke = (invocationDetails) => {
    methodSubscribers.forEach((subscriber) => {
      subscriber(invocationDetails)
    })
  }

  var state = null

  const executeUpdateViaSubscriber = (nextState, executeUpdate) => {
    state = nextState
    updateSubscribers.forEach(subscriber => subscriber(state, executeUpdate))
  }

  state = StateTree(stateDef, executeUpdateViaSubscriber, onInvoke)

  var store = () => state
  store.onUpdate = (subscriber) => {

    const thisSubscriberIndex = newUpdateSubscriberIndex
    newUpdateSubscriberIndex++
    updateSubscribers[thisSubscriberIndex] = subscriber

    return function unsubscribeFromUpdates() {
      delete updateSubscribers[thisSubscriberIndex]
      return true
    }
  }
  store.onMethod = (methodSubscriber) => {

    const thisMethodSubscriberIndex = newMethodSubscriberIndex
    newMethodSubscriberIndex++
    methodSubscribers[thisMethodSubscriberIndex] = methodSubscriber

    return function unsubscribeFromMethods() {
      delete methodSubscribers[thisMethodSubscriberIndex]
      return true
    }
  }
  return store
}
