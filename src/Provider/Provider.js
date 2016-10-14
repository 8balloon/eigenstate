import React from 'react'
import assert from '../validation/assert'
import { propsDidChange } from '../validation/errorMessages'
import StateTree from './StateTree'

export class Provider extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.initialize(props)
  }

  initialize(props) {

    const { stateDef, onInvoke } = props

    assert.stateDefIsObject(stateDef)

    let throwErrFromProvider = (err) => { throw err }
    const executeUpdate = (nextState, callback) => {

      this.stateTree = nextState

      try {
        this.forceUpdate(callback)
      }
      catch (err) {
        throwErrFromProvider(err)
      }
    }

    this.stateTree = StateTree(stateDef, executeUpdate, onInvoke)
  }

  getChildContext() {

    return {
      eigenstate: this.stateTree
    }
  }

  componentDidMount() {

    if (this.props.interface) {
      this.props.interface(() => this.stateTree)
    }
  }

  componentWillReceiveProps(nextProps) {

    const props = this.props

    if (
      (props.stateDef !== nextProps.stateDef) ||
      (props.onInvoke !== nextProps.onInvoke) ||
      (props.interface !== nextProps.interface)
    ) {
      console.warn(propsDidChange, nextProps)
      this.initialize(nextProps)
    }
  }

  render() {

    return React.cloneElement(
      React.Children.only(this.props.children),
      this.stateTree
    )
  }
}

Provider.childContextTypes = {
  eigenstate: React.PropTypes.object.isRequired
}
