//include css
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./', true, /s?css$/));

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import stateDef from './stateDef'
import Components from './components'

import { Provider, verboseLogger } from '../src'

ReactDOM.render(
  <Provider stateDef={stateDef} middleware={verboseLogger}>
    <Components />
  </Provider>,
  document.getElementById('react-root')
)
