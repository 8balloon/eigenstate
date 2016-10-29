import assert from '../validation/assert'
import StateTree from './StateTree'
import Executor from './Executor'

export function Store(stateDef) {

  assert.stateDefIsObject(stateDef)

  let state = null
  let subscribers = []
  let effectors = []

  let callSubsWithDeetsAndTrigger = (nextState, invocationDetails, effectsTrigger) => {

    state = nextState

    subscribers.forEach(sub => sub(invocationDetails))

    if (effectors.length > 0) {

      effectors.forEach(effector => effector(invocationDetails, effectsTrigger))
    }
    else {

      effectsTrigger()
    }
  }
  let executor = Executor(callSubsWithDeetsAndTrigger)
  state = StateTree(stateDef, executor)

  let store = () => state
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
  Object.defineProperty(store, '_setEffector', {
    value: (effector) => {

      assert.subscriberIsFunction(effector) // maybe make another assertion for this?

      const thisEffectorIndex = effectors.length
      effectors[thisEffectorIndex] = effector

      return function unsetEffectingSubscriber() {
        delete effectors[thisEffectorIndex]
        return true
      }
    }
  })

  return store
}
