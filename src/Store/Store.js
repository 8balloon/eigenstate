import assert from '../validation/assert'
import StateTree from './StateTree'
import Batcher from './Batcher'

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
  const batcher = Batcher(callSubsWithDeetsAndTrigger)

  state = StateTree(stateDef, batcher.handleInvocation, batcher.enqueueEffect)

  var store = () => state
  store._setEffectingSubscriber = (effectingSub) => {

    assert.subscriberIsFunction(effectingSub)
    effectingSubscriber = effectingSub
  }
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
