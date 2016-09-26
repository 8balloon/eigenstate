import { Provider, logVerbosely } from '../../src'
import stateDef from './stateDef'
import View from './View'

export default function ErroringCounter() {
  return (
    <Provider stateDef={stateDef} onEvent={logVerbosely} testProviderProp={9000}>
      <View />
    </Provider>
  )
}
