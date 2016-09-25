import React from 'react'
import objectAssign from 'object-assign'
import * as assert from '../validation/assertions'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    const { stateDef, onChange } = props
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

  componentWillReceiveProps(next) {

    const { stateDef, onChange } = this.props

    if ( (stateDef !== next.stateDef) || (onChange !== next.onChange) ) {

      this.setState(Eigenstate(next.stateDef, next.onChange, this))
    }
  }

  render() {

    assert.stateDoesNotConflictWithProps(this.state, this.props)

    //properties take precidence to allow for 'overriding' Eigenstate internals
    const childProps = objectAssign({}, this.state, this.props)

    return React.cloneElement(this.props.children, childProps)
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
