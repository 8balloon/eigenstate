import React from 'react'
import objectAssign from 'object-assign'
import * as assert from '../validation/assertions'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.__eigenstate = null

    this.stateAccessor = {
      getState: () => this.__eigenstate,
      setState: (newState, callback) => {
        this.__eigenstate = newState
        this.forceUpdate(callback && callback())
        /*
        We are not calling onEvent callbacks until React has updated.
        This is to make Eigenstate apps easier to reason about from the perspective of an external application.
        */
      }
    }

    this.__eigenstate = Eigenstate(props, this.stateAccessor)
  }

  getChildContext() {
    return {
      providerProps: this.props,
      eigenstate: this.stateAccessor.getState()
    }
  }

  componentDidMount() {

    if (this.props.eigenstate) {
      this.props.eigenstate(() => this.stateAccessor.getState())
    }
  }

  componentWillReceiveProps(next) {

    const { stateDef, onEvent } = this.props

    if ( (stateDef !== next.stateDef) || (onEvent !== next.onEvent) ) {

      this.stateAccessor.setState(Eigenstate(next, this.stateAccessor))
    }
  }

  render() {

    assert.stateDoesNotConflictWithProps(this.__eigenstate, this.props)

    const childProps = objectAssign({}, this.__eigenstate, this.props)

    return React.cloneElement(this.props.children, childProps)
  }
}

Provider.childContextTypes = {
  providerProps: React.PropTypes.object.isRequired,
  eigenstate: React.PropTypes.object.isRequired
}
