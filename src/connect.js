import React from 'react'
import assert from './validation/assert'

export function connect(Component, store) {

  assert.storeIsFunction(store)

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)

      this.initialize(props)
    }

    initialize(props) {

      let throwErrFromProvider = (err) => { throw err }
      const executeUpdate = (invocationDetails, callback) => {
        try {
          this.forceUpdate(callback)
        }
        catch (err) {
          throwErrFromProvider(err)
        }
      }

      store._setEffectingSubscriber(executeUpdate)
    }

    getChildContext() {

      return {
        eigenstate: !this.context.eigenstate ? store :
          [].concat(this.context.eigenstate, store)
      }
    }

    render() {

      //assert.propsDon'tconflictWithStore()

      // let componentProps = this.context.eigenstate || {}
      let componentProps = {}

      Object.assign(componentProps,
        store(),
        this.props
      )

      return React.createElement(Component, componentProps)
    }
  }

  Connect.contextTypes = {
    eigenstate: React.PropTypes.any //.customProp ?
  }

  Connect.childContextTypes = {
    eigenstate: React.PropTypes.any.isRequired //.customProp ?
  }

  return Connect
}
