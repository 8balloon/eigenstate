import assert from '../validation/assert'
import StateTree from './StateTree'

export function Store(stateDef) {

  assert.stateDefIsObject(stateDef)

  var updateSubs = []
  var methodSubs = []

  const onInvoke = (invocationDetails) => {
    methodSubs.forEach(sub => sub(invocationDetails))
  }

  var state = null

  const executeUpdateViaSubscriber = (nextState, executeUpdate) => {
    state = nextState
    updateSubs.forEach(sub => sub(state, executeUpdate))
  }

  state = StateTree(stateDef, executeUpdateViaSubscriber, onInvoke)

  var store = () => state
  store.onUpdate = (newUpdateSubscriber) => {

    assert.updateSubscriberIsFunction(newUpdateSubscriber)

    const thisUpdateSubIndex = updateSubs.length
    updateSubs[thisUpdateSubIndex] = newUpdateSubscriber

    return function unsubscribeFromUpdates() {
      delete updateSubs[thisUpdateSubIndex]
      return true
    }
  }
  store.onMethod = (newMethodSubscriber) => {

    assert.methodSubscriberIsFunction(newMethodSubscriber)

    const thisMethodSubIndex = methodSubs.length
    methodSubs[thisMethodSubIndex] = newMethodSubscriber

    return function unsubscribeFromMethods() {
      delete methodSubs[thisMethodSubIndex]
      return true
    }
  }
  return store
}
