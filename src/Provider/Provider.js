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
      onAction: (event) => this.onAction && this.onAction(event),
      onUpdate: (update) => this.onUpdate && this.onUpdate(update)
    }

    this.store = Store(storeParams, (callOnUpdateWithState) => {
      this.forceUpdate(callOnUpdateWithState)
    })
  }

  getChildContext() {

    var providerProps = Object.assign({}, this.props)
    delete providerProps.children

    return {
      providerProps,
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

    assert.eigenstateDoesNotConflictWithProps(eigenstate, this.props)

    var childProps = Object.assign({}, eigenstate, this.props)
    delete childProps.children //so we don't pass children to themselves

    return React.cloneElement(
      React.Children.only(this.props.children),
      childProps
    )
  }
}

Provider.childContextTypes = {
  providerProps: React.PropTypes.object.isRequired,
  eigenstate: React.PropTypes.object.isRequired
}
