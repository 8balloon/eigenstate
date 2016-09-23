import objectAssign from 'object-assign'
import WrappedChanges from './WrappedChanges'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    const { stateDef, middleware } = props
    this.state = WrappedChanges(stateDef, middleware, this)
  }

  getChildContext() {
    return {
      wrappedChanges: this.state
    }
  }

  componentWillMount() {

    const { stateDef, middleware } = this.props

    this.setState(WrappedChanges(stateDef, middleware, this))
  }

  componentWillReceiveProps(nextProps) {

    const { stateDef, middleware } = this.props

    if ( (stateDef !== nextProps.stateDef) || (middleware !== nextProps.middleware) ) {

      this.setState(WrappedChanges(nextProps.stateDef, nextProps.middleware, this))
    }
  }

  render() {

    return React.cloneElement(this.props.children, this.state)
  }
}

Provider.childContextTypes = {
  wrappedChanges: React.PropTypes.object.isRequired
}
