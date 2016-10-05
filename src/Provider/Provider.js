import React from 'react'
import assert from '../validation/assert'
import Store from './Store'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    const { stateDef, onUpdate } = props
    this.onUpdate = onUpdate
    onUpdate && assert.onUpdatePropIsFunction(onUpdate)

    const storeParams = {
      stateDef,
      onUpdate: this.onUpdate || (() => {})
    }

    this.store = Store(storeParams, (postUpdateCallback) => {

      const throwErrFromProvider = (err) => { throw err }

      var wrappedCallback = () => {
        try {
          postUpdateCallback()
        }
        catch (err) {
          throwErrFromProvider(err)
        }
      }

      this.forceUpdate(wrappedCallback)
    })
  }

  getChildContext() {

    return {
      eigenstate: this.store.getState()
    }
  }

  componentDidMount() {

    if (this.props.shareInterface) {
      this.props.shareInterface(() => this.store.getState())
    }
  }

  componentWillReceiveProps(next) {

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

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
