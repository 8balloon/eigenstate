import objectAssign from 'object-assign'
import { mapObjectTreeLeaves, getValueByPath, mutSetValueByPath } from '../utils'
import * as assert from '../validation/assertions'

export default function Eigenstate(props, stateAccessor) {

  const { stateDef, onEvent, worker } = props
  const { getState, setState } = stateAccessor

  assert.stateDefIsObject(stateDef)
  onEvent && assert.onEventPropIsFunction(onEvent)

  var latestInvocationID = 0

  //need fallback (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
  var methodWorker = new Worker(worker)

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

          onEvent && onEvent({
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
      else { // this method is an asynchronous procedure, so no value has been returned, and state has not been directly changed.
        onEvent && onEvent({
          methodKey: key,
          methodPath: path,
          payload,
          returnValue: undefined,
          previousLocalState: contextStateAtPath,
          localState: contextStateAtPath,
          state: getState()
        })
      }
    }
  })

  methodWorker.onmessage = function(e) {
    console.log("WORKER MESSAGE RECEIVED:", e)
  }

  return eigenstate
}
