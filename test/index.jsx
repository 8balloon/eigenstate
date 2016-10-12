//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, Link } from 'react-router'

import { Provider, logVerbosely, connect } from '../src'

import CompleteExample from './CompleteExample'

import GeneratedStateDef from './GeneratedStateDef'
import Counter from './Counter'
import Grid from './Grid'
import ErroringCounter from './ErroringCounter'
import ConnectComparison from './ConnectComparison'
import Todos from './Todos'
import EffectsTest from './EffectsTest'

const indexStateDef = {
  helloWorld: null,
  armHelloWorld: (_, state) => ({helloWorld: 'hello, world'})
}

const ReactRouterTester = (props) => (
  <div className="reactRouterTester" style={{backgroundColor: 'orange'}}>
    ROUTE TEST ({props.helloWorld})
    <Link to="/kids">Link to children</Link>
    <Link to="/">Link away from children</Link>
    <div onClick={props.armHelloWorld}>arm hello world</div>
    {props.children}
  </div>
)

const Kids = (props) => {
  return (
    <div>KIDS</div>
  )
}

const Apps = (props) => (
  <div className="apps">
    <GeneratedStateDef />
    <Counter />
    <Grid />
    <ErroringCounter />
    <ConnectComparison />
    <Todos />
    <ReactRouterTester {...props} />
    <EffectsTest />
  </div>
)

const StatefulApps = connect(Apps)

ReactDOM.render(
  <Provider stateDef={indexStateDef}>
    <Router history={hashHistory}>
      <Route path="/" component={StatefulApps}>
        <Route path="kids" component={Kids} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('react-tests')
)

// CompleteExample()
