//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider, logAction } from '../src'

import GeneratedStateDef from './GeneratedStateDef'
import SimpleCounter from './SimpleCounter'
import Counters from './Counters'
import Grid from './Grid'
import ErroringCounter from './ErroringCounter'
import ConnectComparison from './ConnectComparison'
import Todos from './Todos'

ReactDOM.render(
  <div className="apps">

    <GeneratedStateDef />
    <SimpleCounter />
    <Grid />
    <Counters />
    <ErroringCounter />
    <ConnectComparison />
    <Todos />

  </div>,
  document.getElementById('react-root')
)