import { connect } from '../../src'
import Counter from './Counter'

const ConnectedCounter = connect(Counter)

export default function Components(props) {

  return (
    <div id="components">
      {/*
        These two Counters should behave the same.
      */}
      <Counter {...props} />
      <ConnectedCounter />
    </div>
  )
}
