import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'
import { documentationURL } from '../validation/errorMessages'

export default function Eigenstate(stateDefinition, onChange, context) {

  assert.stateDefIsObject(stateDefinition)
  onChange && assert.onChangePropIsFunction(onChange)

  var latestInvocationID = Math.random() //consider starting at 0 and incrementing

  /*stateDef with wrapped methods*/
  const eigenstate = mapObjectTreeLeaves(stateDefinition, (property, key, path, parent) => {

    // Not a method -- just a value. So no wrapping required.
    if (!(property instanceof Function)) return property
    const method = property

    var armedMethod = function callMethodWithContext(payload, illegalSecondArgument) {

      assert.methodWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      const contextState = objectAssign({}, context.state)
      const contextStateAtPath = getValueByPath(contextState, path)

      const thisInvocationID = Math.random()
      latestInvocationID = thisInvocationID

      const localMethodReturns = method(payload, contextStateAtPath)
      assert.methodReturnFitsStateDef(localMethodReturns, parent, key, path)

      const newLocalState = objectAssign({}, contextStateAtPath, localMethodReturns)

      if (newLocalState !== undefined) {

        assert.noOtherMethodsHaveBeenInvoked(thisInvocationID, latestInvocationID)

        const newState = mutSetValueByPath(contextState, path, newLocalState) //semantics? (const, mut...)
        context.setState(newState)
      }

      onChange && onChange({
        key,
        path,
        payload,
        localEigenstate: contextStateAtPath,
        methodReturn: localMethodReturns,
        nextLocalEigenstate: newLocalState
      })
    }

    armedMethod.__definition = method

    return armedMethod
  })

  return eigenstate
}
