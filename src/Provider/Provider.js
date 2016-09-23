import objectAssign from 'object-assign'
import WrappedUpdates from './WrappedUpdates'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    const { updates, middleware } = props
    this.state = WrappedUpdates(updates, middleware, this)
  }

  getChildContext() {
    return {
      wrappedUpdates: this.state
    }
  }

  componentWillMount() {

    const { updates, middleware } = this.props

    this.setState(WrappedUpdates(updates, middleware, this))
  }

  componentWillReceiveProps(nextProps) {

    const { updates, middleware } = this.props
    const { newUpdates, newMiddleware } = nextProps

    if ( (updates !== newUpdates) || (middleware !== newMiddleware) ) {

      this.setState(WrappedUpdates(newUpdates, newMiddleware, this))
    }
  }

  render() {

    return React.cloneElement(this.props.children, this.state)
  }
}

Provider.childContextTypes = {
  wrappedUpdates: React.PropTypes.object.isRequired
}
