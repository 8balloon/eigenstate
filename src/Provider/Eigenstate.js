import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'
import { documentationURL } from '../validation/errorMessages'

export default function Eigenstate(changes, onChange, context) {

  onChange && assert.onChangePropIsFunction(onChange)

  var latestChangeInvocationID = Math.random() //consider starting at 0 and incrementing

  /*stateDef with wrapped change functions*/
  const eigenstate = mapObjectTreeLeaves(changes, (change, key, path, parent) => {

    // Not a change -- just state. So no wrapping required.
    if (!(change instanceof Function)) return change

    var armedChange = function performChangeWithContext(payload, illegalSecondArgument) {

      assert.changeWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      const contextState = objectAssign({}, context.state)
      const contextStateAtPath = getValueByPath(contextState, path)

      const thisChangeInvocationID = Math.random()
      latestChangeInvocationID = thisChangeInvocationID

      const localChangeResults = change(payload, contextStateAtPath)
      assert.changeResultsFitStateDef(localChangeResults, parent, key, path)

      const newLocalState = objectAssign({}, contextStateAtPath, localChangeResults)

      if (newLocalState !== undefined) {

        assert.noOtherChangesHaveBeenInvoked(thisChangeInvocationID, latestChangeInvocationID)

        const newState = mutSetValueByPath(contextState, path, newLocalState) //semantics? (const, mut...)
        context.setState(newState)
      }

      onChange && onChange({
        key,
        path,
        payload,
        localEigenstate: contextStateAtPath,
        changeResults: localChangeResults,
        nextLocalEigenstate: newLocalState
      })
    }

    armedChange.__definition = change

    return armedChange
  })

  return eigenstate
}
