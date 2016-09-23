import objectAssign from 'object-assign'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    const { stateDef, middleware } = props
    this.state = Eigenstate(stateDef, middleware, this)
  }

  getChildContext() {
    return {
      eigenstate: this.state
    }
  }

  componentWillMount() {

    const { stateDef, middleware } = this.props

    this.setState(Eigenstate(stateDef, middleware, this))
  }

  componentWillReceiveProps(nextProps) {

    const { stateDef, middleware } = this.props

    if ( (stateDef !== nextProps.stateDef) || (middleware !== nextProps.middleware) ) {

      this.setState(Eigenstate(nextProps.stateDef, nextProps.middleware, this))
    }
  }

  render() {

    return React.cloneElement(this.props.children, this.state)
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
