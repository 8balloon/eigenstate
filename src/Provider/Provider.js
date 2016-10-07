import React from 'react'
import assert from '../validation/assert'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    const { stateDef, onInvoke } = props

    assert.stateDefIsObject(stateDef)

    onInvoke && assert.onInvokePropIsFunction(onInvoke);
    const onInvocations = !onInvoke ? (() => {}) :
      ((invocations) => invocations.forEach(change => onInvoke(change)))

    const throwErrFromProvider = (err) => { throw err }

    const executeUpdate = (invocations, callback) => {

      try {
        this.forceUpdate(() => {
          onInvocations(invocations)
          callback()
        })
      }
      catch (err) {
        throwErrFromProvider(err)
      }
    }

    this.eigenstate = Eigenstate(stateDef, executeUpdate)
  }

  getChildContext() {

    return {
      eigenstate: this.eigenstate
    }
  }

  componentDidMount() {

    if (this.props.interface) {
      this.props.interface(this.eigenstate)
    }
  }

  componentWillReceiveProps(nextProps) {

    if ( this.props !== nextProps ) {
      throw new Error("The Eigenstate Provider does not support dynamic props.")
    }
  }

  render() {

    return React.cloneElement(
      React.Children.only(this.props.children),
      this.eigenstate
    )
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
