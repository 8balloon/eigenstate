import React from 'react'
import * as assert from './validation/assertions'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {

      assert.eigenstateDoesNotConflictWithProps(this.context.eigenstate, this.props)
      assert.providerPropsDoesNotConflictWithProps(this.context.providerProps, this.props)

      const componentProps = Object.assign({},
        this.context.eigenstate,
        this.context.providerProps,
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
