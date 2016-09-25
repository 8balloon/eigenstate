import React from 'react'
import objectAssign from 'object-assign'
import * as assert from './validation/assertions'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {

      assert.stateDoesNotConflictWithProps(this.context.eigenstate, this.props)

      const componentProps = objectAssign({},
        this.context.eigenstate,
        this.props
      )

      return React.createElement(Component, componentProps)
    }
  }

  Connect.contextTypes = {
    eigenstate: React.PropTypes.object.isRequired
  }

  return Connect
}
