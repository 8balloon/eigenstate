import React from 'react'
import * as assert from './validation/assertions'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {

      assert.stateDoesNotConflictWithProps(this.context.eigenstate, this.props)

      const componentProps = Object.assign({},
        this.context.providerProps,
        this.context.eigenstate,
        this.props
      )

      return React.createElement(Component, componentProps)
    }
  }

  Connect.contextTypes = {
    providerProps: React.PropTypes.object.isRequired,
    eigenstate: React.PropTypes.object.isRequired
  }

  return Connect
}
