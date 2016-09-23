import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'
import { documentationURL } from '../validation/errorMessages'

export default function Eigenstate(changes, middleware, context) {

  middleware && assert.middlewareIsValid(middleware)

  const getState = () => context.state

  var latestChangeInvocationID = Math.random() //consider starting at 0 and incrementing

  /*stateDef with wrapped change functions*/
  const eigenstate = mapObjectTreeLeaves(changes, (change, key, path, parent) => {

    // Not a change -- just state. So no wrapping required.
    if (!(change instanceof Function)) return change

    const performChange = function(resolvedPayload) {

      const contextState = objectAssign({}, context.state)
      const contextStateAtPath = getValueByPath(contextState, path)

      const thisChangeInvocationID = Math.random()
      latestChangeInvocationID = thisChangeInvocationID

      const localChangeResults = change(resolvedPayload, contextStateAtPath)
      assert.changeResultsFitStateDef(localChangeResults, parent, key, path)
      const newLocalState = objectAssign({}, contextStateAtPath, localChangeResults)

      if (newLocalState !== undefined) {

        assert.noOtherChangesHaveBeenInvoked(thisChangeInvocationID, latestChangeInvocationID)

        const newState = mutSetValueByPath(contextState, path, newLocalState) //semantics? (const, mut...)
        context.setState(newState)
      }
    }

    var wrappedChange = function performChangeConsideringMiddleware(payload, illegalSecondArgument) {

      assert.changeWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      if (middleware) {

        middleware(performChange, payload, {
          key,
          path,
          eigenstate
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
