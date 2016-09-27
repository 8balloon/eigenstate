import React from 'react'
import objectAssign from 'object-assign'
import * as assert from '../validation/assertions'
import Store from './Store'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.store = Store(props, (onUpdateCallback) => {
      this.forceUpdate(onUpdateCallback && onUpdateCallback())
    })
  }

  getChildContext() {
    return {
      providerProps: this.props,
      eigenstate: this.store.getState()
    }
  }

  componentDidMount() {

    if (this.props.eigenstate) {
      this.props.eigenstate(() => this.store.getState())
    }
  }

  componentWillReceiveProps(next) {

    const { stateDef, onAction } = this.props

    if ( (stateDef !== next.stateDef) || (onAction !== next.onAction) ) {

      this.store.setState(Eigenstate(next, this.store))
    }
  }

  render() {

    const eigenstate = this.store.getState()

    assert.stateDoesNotConflictWithProps(eigenstate, this.props)

    const childProps = objectAssign({}, eigenstate, this.props)

    return React.cloneElement(this.props.children, childProps)
  }
}

Provider.childContextTypes = {
  providerProps: React.PropTypes.object.isRequired,
  eigenstate: React.PropTypes.object.isRequired
}
