//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider, logVerbosely } from '../src'

import Counter from './Counter'
import Grid from './Grid'
import Todos from './Todos'
import Counters from './Counters'

ReactDOM.render(
  <div id="apps">
    <Counter />
    <Grid />
    <Todos />
    <Counters />
  </div>,
  document.getElementById('react-root')
)
