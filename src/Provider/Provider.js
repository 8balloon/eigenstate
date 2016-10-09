import React from 'react'
import assert from '../validation/assert'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.initialize(props)
  }

  initialize(props) {

    const { stateDef, onInvoke } = props

    assert.stateDefIsObject(stateDef)

    let throwErrFromProvider = (err) => { throw err }
    const executeUpdate = (callback) => {
      try {
        this.forceUpdate(callback)
      }
      catch (err) {
        throwErrFromProvider(err)
      }
    }

    this.eigenstate = Eigenstate(stateDef, executeUpdate, onInvoke)
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

  componentWillReceiveProps(next) {

    const props = this.props

    if (
      (props.stateDef !== next.stateDef) ||
      (props.onInvoke !== next.onInvoke) ||
      (props.interface !== next.interface)
    ) {
      console.warn("An Eigenstate Provider had its props changed. State will be cleared and re-generated. Are you sure you meant to change Provider props? The Provider in question received these new props:", next)
      this.initialize(next)
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
