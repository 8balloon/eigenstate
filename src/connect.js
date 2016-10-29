import React from 'react'
import { mapObjectTreeLeaves } from './utils'
import assert from './validation/assert'

export function connect(Component, storeTree) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)

      this.initialize(props, context)
    }

    initialize(props, context) {

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

        assert.storeIsFunction(storeLeaf) //rewrite this assert xxxxxxxxxxxxxxxxxx

        if (context.eigenstate === undefined) {
          storeLeaf._setEffectingSubscriber(executeUpdate)
          return
        }

        let storeIsInContext = false
        mapObjectTreeLeaves(context.eigenstate, (leaf) => {
          if (leaf === storeLeaf) {
            storeIsInContext = true
          }
        })
        if (!storeIsInContext) {
          storeLeaf._setEffectingSubscriber(executeUpdate)
        }
      })
    }

    getChildContext() {

      var eigenstate = !this.context.eigenstate ? [] :
        [].concat(this.context.eigenstate)

      mapObjectTreeLeaves(storeTree, (storeLeaf) => {
        if (eigenstate.indexOf(storeLeaf) < 0) {
          eigenstate.push(storeLeaf)
        }
      })

      return { eigenstate }
    }

    render() {

      //assert.propsDon'tconflictWithStore() xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

      const effectiveStore = mapObjectTreeLeaves(storeTree, storeLeaf => storeLeaf())

      let componentProps = Object.assign({},
        effectiveStore,
        this.props
      )

      return React.createElement(Component, componentProps)
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
