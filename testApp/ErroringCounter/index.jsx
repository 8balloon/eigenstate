import { Provider, logVerbosely } from '../../src'
import stateDef from './stateDef'
import View from './View'

export default function ErroringCounter() {
  return (
    <Provider stateDef={stateDef}
      onAction={logVerbosely}
      onUpdate={(state) => {console.log("!!!UPDATE OCCURRED:", state)}}
      testProviderProp={9000}>
      <View />
    </Provider>
  )
}
