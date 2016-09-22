import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'
import { documentationURL } from '../validation/errorMessages'

export default function WrappedUpdates(updates, middleware, providerContext) {

  middleware && assert.middlewareIsValid(middleware)

  const getState = () => providerContext.state

  var latestUpdateInvocationID = Math.random()

  const wrappedUpdates = mapObjectTreeLeaves(updates, (update, key, path, parent) => {

    if (!(update instanceof Function)) return update

    const performUpdate = function(resolvedPayload) {

      const state = providerContext.state
      const stateAtPath = getValueByPath(state, path)
      const wrappedUpdatesAtPath = getValueByPath(wrappedUpdates, path)

      const thisUpdateInvocationID = Math.random()
      latestUpdateInvocationID = thisUpdateInvocationID

      const newLocalState = update(resolvedPayload, stateAtPath, wrappedUpdatesAtPath)

      if (newLocalState !== undefined) {

        if (thisUpdateInvocationID !== latestUpdateInvocationID) {
          throw new Error(`Update ${key} at path ${path} is incorrectly composed, and will result in an inconsistent state when used. Updates should return a value OR call other updates. See "Updates: Operations and Procedures" at ${documentationURL}`)
        }

        assert.newStateContainsShapeOfOriginalState(newLocalState, parent, key, path)

        const newState = mutSetValueByPath(state, path, newLocalState)
        providerContext.setState(newState)
      }
    }

    var wrappedUpdate = function performUpdateConsideringMiddleware(payload, illegalSecondArgument) {

      assert.updateWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      if (middleware) {

        middleware(performUpdate, payload, {
          key,
          path,
          updates: wrappedUpdates,
          getState
        })
      }
      else {
        performUpdate(payload)
      }
    }

    wrappedUpdate.__baseUpdateFunction = update

    return wrappedUpdate
  })

  return wrappedUpdates
}
