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

      let throwErrFromProvider = (err) => { throw err }
      const executeUpdate = (invocationDetails, callback) => {
        try {
          this.forceUpdate(callback)
        }
        catch (err) {
          throwErrFromProvider(err)
        }
      }

      mapObjectTreeLeaves(storeTree, (storeLeaf) => {

        assert.storeIsFunction(storeLeaf) //rewrite this assert

        if (context.eigenstate) {
          let storeIsInContext = false
          mapObjectTreeLeaves(context.eigenstate, (leaf) => {
            if (leaf === storeLeaf) {
              storeIsInContext = true
              console.log("DANGGGG")
            }
          })
          if (!storeIsInContext) {
            console.log("YAY!", context)
            storeLeaf._setEffectingSubscriber(executeUpdate)
          }
        }
        else {
          console.log("NO CONTEXT!")
          storeLeaf._setEffectingSubscriber(executeUpdate)
        }

      })
    }

    getChildContext() {

      return {
        eigenstate: !this.context.eigenstate ? [storeTree] :
          [].concat(this.context.eigenstate, storeTree)
      }
    }

    render() {

      //assert.propsDon'tconflictWithStore()

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
