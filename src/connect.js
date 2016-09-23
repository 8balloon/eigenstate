import objectAssign from 'object-assign'

export function connect(Component) {

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
    }

    render() {
      return React.createElement(Component, this.context.eigenstate)
    }
  }

  Connect.contextTypes = {
    eigenstate: React.PropTypes.object.isRequired
  }

  return Connect
}
