import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'

/*
An Eigenstate is a stateDef + wrapped state methods that update context state values.
The wrapped state methods returned by Eigenstate remain unchanged and accessible via the context, but state values are updated by those state methods, so they change.
This means that the values of the original Eigenstate instance are overwritten, while its methods remain the same.
It is consistent because it is changing in a way which was a part of its definition.
*/

export default function Eigenstate(props, stateAccessor) {

  const { stateDef, onChange } = props
  const { getState, setState } = stateAccessor

  assert.stateDefIsObject(stateDef)
  onChange && assert.onChangePropIsFunction(onChange)

  var latestInvocationID = 0

  const eigenstate = mapObjectTreeLeaves(stateDef, (property, key, path, localStateDef) => {

    // Not a method -- just a value. So no "arming" required.
    if (!(property instanceof Function)) return property
    const method = property

    return function armedMethod(payload, illegalSecondArgument) {

      assert.methodWasNotPassedSecondArgument(illegalSecondArgument, key, path)

      const contextState = getState()
      const contextStateAtPath = getValueByPath(contextState, path)

      const thisInvocationID = latestInvocationID + 1
      latestInvocationID = thisInvocationID

      const localMethodReturn = method(payload, contextStateAtPath)


      if (localMethodReturn !== undefined) { //this method is a synchronous operation, not a procedure

        assert.operationCompletedSynchronously(thisInvocationID, latestInvocationID, key, path)
        assert.methodReturnFitsStateDef(localMethodReturn, localStateDef, key, path)

        const newLocalState = objectAssign({}, contextStateAtPath, localMethodReturn)

        const newState = mutSetValueByPath(contextState, path, newLocalState) //semantics? (const, mut...)
        setState(newState, () => {

          onChange && onChange({
            methodKey: key,
            methodPath: path,
            payload,
            returnValue: localMethodReturn,
            previousLocalState: contextStateAtPath,
            localState: newLocalState,
            state: getState()
          })
        })
      }
      // else { // this method is an asynchronous procedure, not an operation
      //   onChange && onChange({
      //     key,
      //     methodPath: path,
      //     payload,
      //     returnValue: undefined,
      //     previousLocalState: contextStateAtPath,
      //     localState: contextStateAtPath,
      //     state: contextState
      //   })
      // }
    }
  })

  return eigenstate
}
