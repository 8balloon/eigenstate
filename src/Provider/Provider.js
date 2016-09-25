import React from 'react'
import objectAssign from 'object-assign'
import * as assert from '../validation/assertions'
import Eigenstate from './Eigenstate'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    const { stateDef, onChange } = props

    this.eigenstate = null

    const stateAccess = {
      getState: () => this.eigenstate,
      setState: (newState, callback) => {
        this.eigenstate = newState
        this.forceUpdate()
        callback()
      }
    }

    this.eigenstate = Eigenstate(stateDef, onChange, stateAccess)
  }

  getChildContext() {
    return {
      eigenstate: this.eigenstate
    }
  }

  // componentWillMount() {
  //
  //   const { stateDef, onChange } = this.props
  //
  //   const eigenstate = Eigenstate(stateDef, onChange, this)
  //   this.eigenstate = eigenstate
  //   this.setState(eigenstate)
  // }

  componentDidMount() {

    if (this.props.eigenstate) {
      this.props.eigenstate(() => this.eigenstate)
    }
  }

  // componentWillReceiveProps(next) {
  //
  //   const { stateDef, onChange } = this.props
  //
  //   if ( (stateDef !== next.stateDef) || (onChange !== next.onChange) ) {
  //
  //     const eigenstate = Eigenstate(next.stateDef, next.onChange, this)
  //     this.eigenstate = eigenstate
  //     this.setState(eigenstate)
  //   }
  // }

  render() {

    assert.stateDoesNotConflictWithProps(this.eigenstate, this.props)

    //properties take precidence to allow for 'overriding' Eigenstate internals
    const childProps = objectAssign({}, this.eigenstate, this.props)

    return React.cloneElement(this.props.children, childProps)
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
