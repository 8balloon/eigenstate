//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider, logVerbosely } from '../src'

import SimpleCounter from '../examples/SimpleCounter'
import Counters from '../examples/Counters'
import Grid from '../examples/Grid'

import ErroringCounter from './ErroringCounter'
import ConnectCounterCompare from './ConnectCounterCompare'
import Todos from './Todos'

ReactDOM.render(
  <div id="apps">

    <SimpleCounter />
    <Grid />
    <Counters />

    <ErroringCounter />
    <ConnectCounterCompare />
    <Todos />

  </div>,
  document.getElementById('react-root')
)
