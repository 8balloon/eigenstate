import React from 'react'
import assert from '../validation/assert'
import { propsDidChange } from '../validation/errorMessages'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.initialize(props)
  }

  initialize(props) {

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

    props.store.subscribe(executeUpdate)
  }

  getChildContext() {

    return {
      eigenstate: this.props.store()
    }
  }

  componentWillReceiveProps(next) {

    assert.storeDidNotChange(this.props.store, next.store)
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
