import React from 'react'
import objectAssign from 'object-assign'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    const { stateDef, onChange } = props

    if ( !(stateDef instanceof Object) || (stateDef instanceof Function) || (stateDef === null) ) {
      throw new Error("stateDef is required")
    }

    this.state = Eigenstate(stateDef, onChange, this)
  }

  getChildContext() {
    return {
      eigenstate: this.state
    }
  }

  componentWillMount() {

    const { stateDef, onChange } = this.props

    this.setState(Eigenstate(stateDef, onChange, this))
  }

  componentDidMount() {

    if (this.props.onCreate) {
      this.props.onCreate(() => this.state)
    }
  }

  componentWillReceiveProps(nextProps) {

    const { stateDef, onChange } = this.props

    if ( (stateDef !== nextProps.stateDef) || (onChange !== nextProps.onChange) ) {

      this.setState(Eigenstate(nextProps.stateDef, nextProps.onChange, this))
    }
  }

  render() {

    return React.cloneElement(this.props.children, this.state)
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
