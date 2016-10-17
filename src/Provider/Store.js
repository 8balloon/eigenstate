import StateTree from './StateTree'

export default function Store(stateDef, optionalOnInvoke) {

  var subscribers = []
  var newSubscriberIndex = 2

  var state = null

  const executeUpdateViaSubscriber = (nextState, executeUpdate) => {
    state = nextState
    subscribers.forEach(subscriber => subscriber(state, executeUpdate))
  }

  state = StateTree(stateDef, executeUpdateViaSubscriber, optionalOnInvoke)

  var store = () => state
  store.subscribe = (subscriber) => {

    const thisSubscriberIndex = newSubscriberIndex
    newSubscriberIndex++
    subscribers[thisSubscriberIndex] = subscriber

    return function unsubscribe() {
      delete subscribers[thisSubscriberIndex]
    }
  }
  store.destroy = () => {
    subscribers = null
    state = null
    store = null
    return true
  }
  return store
}
