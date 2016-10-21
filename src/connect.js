import React from 'react'
import assert from './validation/assert'

export function connect(Component, propTypes) {

  class Connect extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {

      if (!propTypes) return true

      const contextState = this.context.eigenstateStoreState
      const nextContextState = nextContext.eigenstateStoreState

      for (var propKey in propTypes) {
        if (contextState[propKey] !== nextContextState[propKey])
          return true
      }
      return false
    }

    render() {

      const componentProps = Object.assign({},
        this.context.eigenstateStoreState,
        this.props // including children, since they're the children of what we're creating
      )

      return React.createElement(Component, componentProps)
    }
  }

  Connect.contextTypes = {
    eigenstateStoreState: propTypes ?
      React.PropTypes.shape(propTypes) :
      React.PropTypes.object.isRequired
  }

  return Connect
}
