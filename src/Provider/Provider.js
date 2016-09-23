import objectAssign from 'object-assign'
import WrappedChanges from './WrappedChanges'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    const { changes, middleware } = props
    this.state = WrappedChanges(changes, middleware, this)
  }

  getChildContext() {
    return {
      wrappedChanges: this.state
    }
  }

  componentWillMount() {

    const { changes, middleware } = this.props

    this.setState(WrappedChanges(changes, middleware, this))
  }

  componentWillReceiveProps(nextProps) {

    const { changes, middleware } = this.props
    const { newChanges, newMiddleware } = nextProps

    if ( (changes !== newChanges) || (middleware !== newMiddleware) ) {

      this.setState(WrappedChanges(newChanges, newMiddleware, this))
    }
  }

  render() {

    return React.cloneElement(this.props.children, this.state)
  }
}

Provider.childContextTypes = {
  wrappedChanges: React.PropTypes.object.isRequired
}
