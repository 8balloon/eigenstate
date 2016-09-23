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
      extraProps: this.props.extraProps,
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

      const wrappedUpdates = WrappedUpdates(newUpdates, newMiddleware, this)
      this.setState(wrappedUpdates)
    }
  }

  render() {

    const childProps = objectAssign({},
      this.props.extraProps,
      this.state
    )

    return React.cloneElement(this.props.children, childProps)
  }
}

Provider.childContextTypes = {
  extraProps: React.PropTypes.object.isRequired,
  wrappedUpdates: React.PropTypes.object.isRequired
}
