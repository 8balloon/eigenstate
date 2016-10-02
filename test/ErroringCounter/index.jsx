import { Provider, logAction } from '../../src'
import stateDef from './stateDef'
import View from './View'

export default function ErroringCounter() {
  return (
    <Provider stateDef={stateDef} onAction={logAction}
      onUpdate={(state) => {console.log("!!!UPDATE OCCURRED:", state)}}>
      <View />
    </Provider>
  )
}
