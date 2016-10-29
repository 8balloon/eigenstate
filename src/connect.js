import React from 'react'
import Immutable from 'seamless-immutable'
import { mapObjectTreeLeaves } from './utils'
import assert from './validation/assert'

export function connect(Component, storeTree) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)

      this.effectorUnsetFuncs = []

      let throwErrFromConnectComponent = (err) => { throw err }
      const executeUpdate = (invocationDetails, callback) => {
        try {
          this.forceUpdate(callback)
        }
        catch (err) {
          throwErrFromConnectComponent(err)
        }
      }

      mapObjectTreeLeaves(storeTree, (storeLeaf) => {

        assert.storeIsFunction(storeLeaf)

        let storeIsInContext = false
        mapObjectTreeLeaves(context.eigenstate, (leaf) => {
          if (leaf === storeLeaf) {
            storeIsInContext = true
          }
        })
        if (!storeIsInContext) {
          this.effectorUnsetFuncs.push(
            storeLeaf._setEffector(executeUpdate)
          )
        }
      })
    }

    componentWillUnmount() {

      this.effectorUnsetFuncs.forEach(unsub => unsub())
    }

    render() {

      const storeTreeState = Immutable(
        mapObjectTreeLeaves(storeTree, storeLeaf => storeLeaf())
      )

      assert.stateNotOverriddenByProps(storeTreeState, this.props, Component)

      let componentProps = Object.assign({}, storeTreeState, this.props)

      return React.createElement(Component, componentProps)
    }

    getChildContext() {

      let eigenstate = !this.context.eigenstate ? [] :
      [].concat(this.context.eigenstate)

      mapObjectTreeLeaves(storeTree, (storeLeaf) => {
        if (eigenstate.indexOf(storeLeaf) < 0) { // could be optimized
          eigenstate.push(storeLeaf)
        }
      })

      return { eigenstate }
    }
  }

  Connect.contextTypes = {
    eigenstate: React.PropTypes.array
  }
  Connect.childContextTypes = {
    eigenstate: React.PropTypes.array.isRequired
  }

  return Connect
}
