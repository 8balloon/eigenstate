//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, Link } from 'react-router'

import { Store, connect } from '../src'

import Counter from './Counter'
import Grid from './Grid'
// import ErroringCounter from './ErroringCounter'
// import ConnectComparison from './ConnectComparison'
// import Todos from './Todos'
// import EffectsTest from './EffectsTest'
// import GeneratedStore from './GeneratedStore/GeneratedStore'

const indexStore = Store({
  helloWorld: null,
  armHelloWorld: (_, state) => ({helloWorld: 'hello, world'})
})

const ReactRouterTester = (props) => (
  <div className="reactRouterTester" style={{backgroundColor: 'orange'}}>
    ROUTE TEST ({props.helloWorld})
    <Link to="/kids">Link to children</Link>
    <Link to="/">Link away from children</Link>
    <Link to="/rrTester">Link to store-recursive thing</Link>
    <div onClick={props.armHelloWorld}>arm hello world</div>
    {props.children}
  </div>
)

const InternalTesterApp = connect(ReactRouterTester, indexStore)

const Kids = (props) => {
  return (
    <div>KIdS</div>
  )
}

const Apps = (props) => (
  <div className="apps">
    <Counter />
    <Grid />
  {/*
    <GeneratedStore />
    <ErroringCounter />
    <ConnectComparison />
    <Todos />
    <EffectsTest />*/}
    <ReactRouterTester {...props} />
  </div>
)

const StatefulApps = connect(Apps, indexStore)

ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={StatefulApps}>
        <Route path="kids" component={Kids} />
        <Route path="rrTester" component={InternalTesterApp} />
      </Route>
    </Router>,
  document.getElementById('react-tests')
)
