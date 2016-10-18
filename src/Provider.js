import React from 'react'
import assert from './validation/assert'
import { propsDidChange } from './validation/errorMessages'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.unsubscribe = null

    this.initialize(props)
  }

  initialize(props) {

    if (this.unsubscribe !== null) {

      this.unsubscribe()
      this.unsubscribe = null
    }

    assert.storeIsFunction(props.store)

    let throwErrFromProvider = (err) => { throw err }
    const executeUpdate = (nextState, callback) => {
      try {
        this.forceUpdate(callback)
      }
      catch (err) {
        throwErrFromProvider(err)
      }
    }

    this.unsubscribe = props.store.onUpdate(executeUpdate)
  }

  componentWillReceiveProps(next) {

    if (this.props.store !== next.store) {

      this.initialize(next)
    }
  }

  componentWillUnmount() {

    if (this.unsubscribe !== null) {

      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  getChildContext() {

    return {
      eigenstate: this.props.store()
    }
  }

  render() {

    return React.cloneElement(
      React.Children.only(this.props.children),
      this.props.store()
    )
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
