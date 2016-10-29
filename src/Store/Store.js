import assert from '../validation/assert'
import StateTree from './StateTree'
import Executor from './Executor'

export function Store(stateDef) {

  assert.stateDefIsObject(stateDef)

  var state = null
  var effectingSubscriber = null
  var subscribers = []

  let callSubsWithDeetsAndTrigger = (nextState, invocationDetails, effectsTrigger) => {

    state = nextState

    subscribers.forEach(sub => sub(invocationDetails))

    if (effectingSubscriber) {

      effectingSubscriber(invocationDetails, effectsTrigger)
    }
    else {

      effectsTrigger()
    }
  }
  let executor = Executor(callSubsWithDeetsAndTrigger)
  state = StateTree(stateDef, executor)

  var store = () => state
  Object.defineProperty(store, '_setEffectingSubscriber', {
    value: (effectingSub) => {

      assert.subscriberIsFunction(effectingSub)
      effectingSubscriber = effectingSub
    }
  })
  Object.defineProperty(store, 'subscribe', {
    value: (newSub) => {

      assert.subscriberIsFunction(newSub)

      const thisSubscriberIndex = subscribers.length
      subscribers[thisSubscriberIndex] = newSub

      return function unsubscribeFromUpdates() {
        delete subscribers[thisSubscriberIndex]
        return true
      }
    }
  })
  return store
}
