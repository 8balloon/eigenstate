import React from 'react'
import assert from '../validation/assert'
import { propsDidChange } from '../validation/errorMessages'
import Store from './Store'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.initialize(props)
  }

  initialize(props) {

    const { stateDef, onInvoke } = props

    let throwErrFromProvider = (err) => { throw err }
    const executeUpdate = (nextState, callback) => {

      try {
        this.forceUpdate(callback)
      }
      catch (err) {
        throwErrFromProvider(err)
      }
    }

    this.store = Store(stateDef, onInvoke)
    this.store.subscribe(executeUpdate)
  }

  getChildContext() {

    return {
      eigenstate: this.store()
    }
  }

  componentWillReceiveProps(nextProps) {

    const props = this.props

    if (
      (props.stateDef !== nextProps.stateDef) ||
      (props.onInvoke !== nextProps.onInvoke)
    ) {
      console.warn(propsDidChange, nextProps)
      this.initialize(nextProps)
    }
  }

  render() {

    return React.cloneElement(
      React.Children.only(this.props.children),
      this.store()
    )
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
