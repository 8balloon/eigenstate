import React from 'react'
import assert from '../validation/assert'
import Store from './Store'

export class Provider extends React.Component {

  constructor(props, context) {
    
    super(props, context)

    const { stateDef, onUpdate } = props

    onUpdate && assert.onUpdatePropIsFunction(onUpdate)
    this.onUpdate = onUpdate || (() => {})

    const throwErrFromProvider = (err) => { throw err }

    const executeUpdate = (changes, callback) => {

      try {
        this.forceUpdate(() => {
          this.onUpdate(changes)
          callback()
        })
      }
      catch (err) {
        throwErrFromProvider(err)
      }
    }

    this.store = Store(stateDef, executeUpdate)
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
