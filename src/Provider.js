import React from 'react'
import Immutable from 'seamless-immutable'
import { mapObjectTreeLeaves } from './utils'
import assert from './validation/assert'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.effectorUnsetters = []

    this.initialize(props)
  }

  initialize(props) {

    this.effectorUnsetters.forEach(unset => unset())
    this.effectorUnsetters = []

    let throwErrFromProviderComponent = (err) => { throw err }
    const executeUpdate = (invocationDetails, callback) => {
      try {
        this.forceUpdate(callback)
      }
      catch (err) {
        throwErrFromProviderComponent(err)
      }
    }

    this.storeTreeState = Immutable(mapObjectTreeLeaves(props.store, (storeLeaf) => {

      assert.storeIsFunction(storeLeaf)

      this.effectorUnsetters.push(storeLeaf._setEffector(executeUpdate))

      return storeLeaf()
    }))
  }

  componentWillReceiveProps(next) {

    if (this.props.store !== next.store) this.initialize(next)
  }

  componentWillUnmount() {

    this.effectorUnsetters.forEach(unset => unset())
  }

  render() {

    mapObjectTreeLeaves(this.props.store, (storeLeaf, key, path) => {

      if (path === undefined) {

        this.storeTreeState = this.storeTreeState.merge(storeLeaf())
      }
      else if (path.length === 0) {

        this.storeTreeState = this.storeTreeState.setIn([key], storeLeaf())
      }
      else {

        this.storeTreeState = this.storeTreeState.setIn([...path, key], storeLeaf())
      }
    })

    return React.cloneElement(
      React.Children.only(this.props.children),
      this.storeTreeState
    )
  }

  getChildContext() {

    return { eigenstate: this.storeTreeState }
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.any
}
