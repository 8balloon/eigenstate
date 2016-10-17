import StateTree from './StateTree'

export default function Store(stateDef, optionalOnInvoke) {

  var subscribers = []
  var newSubscriberIndex = 2

  var state = null

  const executeUpdate = (nextState, executeEffects) => {
    state = nextState
    subscribers.forEach(subscriber => subscriber(state, executeEffects))
  }

  state = StateTree(stateDef, executeUpdate, optionalOnInvoke)

  var store = () => state
  store.subscribe = (subscriber) => {

    subscriber(state)

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
