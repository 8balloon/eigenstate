import WrappedUpdates from './WrappedUpdates'

export const Provider = React.createClass({

  componentWillMount: function() {

    const { updates, middleware } = this.props

    const wrappedUpdates = WrappedUpdates(updates, middleware, this)
    this.setState(wrappedUpdates)
  },

  componentWillReceiveProps: function(nextProps) {

    const { updates, middleware } = this.props
    const { newUpdates, newMiddleware } = nextProps

    if ( (updates !== newUpdates) || (middleware !== newMiddleware) ) {

      const wrappedUpdates = WrappedUpdates(newUpdates, newMiddleware, this)
      this.setState(wrappedUpdates)
    }
  },

  render: function() {

    const childProps = Object.assign({},
      this.props,
      this.state
    )

    return React.cloneElement(this.props.children, childProps)
  }
})
