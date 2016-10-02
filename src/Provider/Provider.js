import React from 'react'
import * as assert from '../validation/assertions'
import Store from './Store'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    const { stateDef, onAction, onUpdate } = props
    this.onAction = onAction
    this.onUpdate = onUpdate

    const storeParams = {
      stateDef,
      onAction: this.onAction || (() => {}),
      onUpdate: this.onUpdate || (() => {})
    }

    this.store = Store(storeParams, (callOnUpdateWithState) => {
      this.forceUpdate(callOnUpdateWithState)
    })

    assert.eigenstateDoesNotOverrideParentContext(
      this.store.getState(),
      context.eigenstate
    )
  }

  getChildContext() {

    return {
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

    return React.cloneElement(
      React.Children.only(this.props.children),
      eigenstate
    )
  }
}

Provider.contextTypes = {
  eigenstate: React.PropTypes.object
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
