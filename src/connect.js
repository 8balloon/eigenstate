import objectAssign from 'object-assign'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {
      return React.createElement(Component, this.context.wrappedChanges)
    }
  }

  Connect.contextTypes = {
    wrappedChanges: React.PropTypes.object.isRequired
  }

  return Connect
}
