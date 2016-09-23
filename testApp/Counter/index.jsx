import { Provider, logVerbosely, connect } from '../../src'
import stateDef from './stateDef'
import View from './View'

const ConnectedView = connect(View)
const ViewsWithAlternativelyProvidedProps = (props) => (
  <div>
    <View {...props} />
    <ConnectedView />
  </div>
)

export default function Counter() {
  return (
    <Provider stateDef={stateDef} onChange={logVerbosely}>
      <ViewsWithAlternativelyProvidedProps />
    </Provider>
  )
}
