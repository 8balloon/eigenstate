import { Store, Provider } from '../../src'

export const counterState = {
  count: 0,
  color: 'red',
  increment: (amount, state) => ({ count: state.count + amount }),
  delayedIncrement: (payload, state) => {
    const { amount, delay } = payload
    setTimeout(function callback() { state.increment(amount) }, delay)
  },
  changeColor: (_, state) => ({ color: state.color === 'red' ? 'blue' : 'red' })
}
export const counterStore = Store(counterState)

export const NestedCounterView = (props) => {

  const { nestedProps } = props

  return (
    <div id="counter" style={{backgroundColor: nestedProps.color}}>
      { nestedProps.count }
      <div onClick={() => nestedProps.increment(1)}> NAMESPACED INCREMENT </div>
      <div onClick={() => nestedProps.delayedIncrement({ amount: 10, delay: 1000 })}>
        NAMESPACED SLOW INCREMENT
      </div>
      <div onClick={nestedProps.changeColor}> NAMESPACED CHANGE COLOR </div>
    </div>
  )
}

export const DeeplyNestedCounterView = (props) => {

  const deeplyNestedprops = props.deeply.nested.props;

  return (
    <div id="counter" style={{backgroundColor: deeplyNestedprops.color}}>
      { deeplyNestedprops.count }
      <div onClick={() => deeplyNestedprops.increment(1)}> NAMESPACED INCREMENT </div>
      <div onClick={() => deeplyNestedprops.delayedIncrement({ amount: 10, delay: 1000 })}>
        NAMESPACED SLOW INCREMENT
      </div>
      <div onClick={deeplyNestedprops.changeColor}> NAMESPACED CHANGE COLOR </div>
    </div>
  )
}

const Examples = (props) => <div>
  <NestedCounterView {...props} />
  <DeeplyNestedCounterView {...props} />
</div>

export default () => { return (
  <Provider store={{
    nestedProps: counterStore,
    deeply: { nested: { props: Store(counterState)}}
  }}>
    <Examples />
  </Provider>
)}
