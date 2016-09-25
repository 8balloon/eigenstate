import React from 'react'
import objectAssign from 'object-assign'
import * as assert from '../validation/assertions'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    const { stateDef, onChange } = props

    this.__eigenstate = null

    this.stateAccessor = {
      getState: () => this.__eigenstate,
      setState: (newState, callback) => {
        this.__eigenstate = newState
        this.forceUpdate(callback())
      }
    }

    this.__eigenstate = Eigenstate(stateDef, onChange, this.stateAccessor)
  }

  getChildContext() {
    return {
      eigenstate: this.stateAccessor.getState()
    }
  }

  componentDidMount() {

    if (this.props.eigenstate) {
      this.props.eigenstate(() => this.stateAccessor.getState())
    }
  }

  componentWillReceiveProps(next) {

    const { stateDef, onChange } = this.props

    if ( (stateDef !== next.stateDef) || (onChange !== next.onChange) ) {

      this.stateAccessor.setState(Eigenstate(next.stateDef, next.onChange, this))
    }
  }

  render() {

    assert.stateDoesNotConflictWithProps(this.__eigenstate, this.props)

    const childProps = objectAssign({}, this.__eigenstate, this.props)

    return React.cloneElement(this.props.children, childProps)
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
