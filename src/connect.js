import React from 'react'
import assert from './validation/assert'

export function connect(Component, propTypes) {

  if (propTypes) Component.propTypes = propTypes

  class Connect extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {

      if (!propTypes) return true

      const contextState = this.context.eigenstate
      const nextContextState = nextContext.eigenstate

      for (var propKey in propTypes) {
        if (contextState[propKey] !== nextContextState[propKey])
          return true
      }
      return false
    }

    render() {

      const componentProps = Object.assign({},
        this.context.eigenstate,
        this.props // including children, since they're the children of what we're creating
      )

      return React.createElement(Component, componentProps)
    }
  }

  Connect.contextTypes = {
    eigenstate: React.PropTypes.object.isRequired
  }

  return Connect
}
