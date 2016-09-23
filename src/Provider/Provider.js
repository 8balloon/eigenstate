import objectAssign from 'object-assign'
import WrappedUpdates from './WrappedUpdates'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.providerProps = props
    this.wrappedUpdates = WrappedUpdates(props.updates, props.middleware, this)
    this.state = this.wrappedUpdates
  }

  getChildContext() {

    return {
      providerProps: this.providerProps,
      wrappedUpdates: this.wrappedUpdates
    }
  }

  componentWillMount() {

    const { updates, middleware } = this.props

    const wrappedUpdates = WrappedUpdates(updates, middleware, this)
    this.setState(wrappedUpdates)
  }

  componentWillReceiveProps(nextProps) {

    const { updates, middleware } = this.props
    const { newUpdates, newMiddleware } = nextProps

    if ( (updates !== newUpdates) || (middleware !== newMiddleware) ) {

      const wrappedUpdates = WrappedUpdates(newUpdates, newMiddleware, this)
      this.setState(wrappedUpdates)
    }
  }

  render() {

    const childProps = objectAssign({},
      this.props,
      this.state
    )

    return React.cloneElement(this.props.children, childProps)
  }
}

Provider.childContextTypes = {
  providerProps: React.PropTypes.object.isRequired,
  wrappedUpdates: React.PropTypes.object.isRequired
}
