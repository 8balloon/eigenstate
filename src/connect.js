import React from 'react'
import * as assert from './validation/assertions'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {

      assert.eigenstateDoesNotConflictWithProps(this.context.eigenstate, this.props)

      const componentProps = Object.assign({},
        this.context.eigenstate,
        this.props //children good, since it's children of what we're creating
      )

      return React.createElement(Component, componentProps)
    }
  }

  Connect.contextTypes = {
    eigenstate: React.PropTypes.object.isRequired
  }

  return Connect
}
