import React from 'react'

export function connect(Component, propTypes) {

  const Connect = (props, context) => {

    const componentProps = Object.assign({},
      context.eigenstate,
      props
    )

    return React.createElement(Component, componentProps)
  }

  Connect.contextTypes = {
    eigenstate: React.PropTypes.object.isRequired
  }

  return Connect
}
