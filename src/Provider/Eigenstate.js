import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'
import { documentationURL } from '../validation/errorMessages'

export default function Eigenstate(changes, middleware, providerContext) {

  middleware && assert.middlewareIsValid(middleware)

  const getState = () => providerContext.state

  var latestChangeInvocationID = Math.random()

  const eigenstate = mapObjectTreeLeaves(changes, (change, key, path, parent) => {

    // Not a change -- just state. Do not modify.
    if (!(change instanceof Function)) return change

    const performChange = function(resolvedPayload) {

      const state = providerContext.state
      const stateAtPath = getValueByPath(state, path)
      const eigenstateAtPath = getValueByPath(eigenstate, path)

      const thisChangeInvocationID = Math.random()
      latestChangeInvocationID = thisChangeInvocationID

      const localStateChanges = change(resolvedPayload, stateAtPath, eigenstateAtPath)
      assert.changesMatchDefinition(localStateChanges, parent, key, path)
      const newLocalState = objectAssign({}, stateAtPath, localStateChanges)

      if (newLocalState !== undefined) {

        if (thisChangeInvocationID !== latestChangeInvocationID) {
          throw new Error(`Change ${key} at path ${path} is incorrectly composed, and will result in an inconsistent state when used. Changes should return a value OR call other changes. See "Changes: Operations and Procedures" at ${documentationURL}`)
        }

        assert.newStateMatchesDefinition(newLocalState, parent, key, path) //remove?

        const newState = mutSetValueByPath(state, path, newLocalState)
        providerContext.setState(newState)
      }
    }

    var wrappedChange = function performChangeConsideringMiddleware(payload, illegalSecondArgument) {

      assert.changeWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      if (middleware) {

        middleware(performChange, payload, {
          key,
          path,
          changes: eigenstate,
          getState
        })
      }
      else {
        performChange(payload)
      }
    }

    wrappedChange.__baseChangeFunction = change

    return wrappedChange
  })

  return eigenstate
}
