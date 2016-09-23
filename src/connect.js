import objectAssign from 'object-assign'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {

      window.context = this

      const childProps = objectAssign({},
        this.context.providerProps,
        this.context.wrappedUpdates
      )

      return React.createElement(Component, childProps)
    }
  }

  Connect.contextTypes = {
    providerProps: React.PropTypes.object.isRequired,
    wrappedUpdates: React.PropTypes.object.isRequired
  }

  return Connect
}
