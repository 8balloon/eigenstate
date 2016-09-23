import objectAssign from 'object-assign'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {

      const childProps = objectAssign({},
        this.context.extraProps,
        this.context.wrappedUpdates
      )

      return React.createElement(Component, childProps)
    }
  }

  Connect.contextTypes = {
    extraProps: React.PropTypes.object.isRequired,
    wrappedUpdates: React.PropTypes.object.isRequired
  }

  return Connect
}
