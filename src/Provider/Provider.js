import React from 'react'
import objectAssign from 'object-assign'
import * as assert from '../validation/assertions'
import Store from './Store'

const noop = () => {}

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    const { stateDef, onAction, onUpdate } = props
    this.onAction = onAction
    this.onUpdate = onUpdate

    const storeParams = {
      onAction: (event) => this.onAction && this.onAction(event),
      onUpdate: (update) => this.onUpdate && this.onUpdate(update),
      stateDef
    }

    this.store = Store(storeParams, (callOnUpdateWithState) => {
      this.forceUpdate(callOnUpdateWithState)
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

    this.onAction = next.onAction
    this.onUpdate = next.onUpdate

    if (this.props.stateDef !== next.stateDef) {

      this.store.updateStateDef(next.stateDef)
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
